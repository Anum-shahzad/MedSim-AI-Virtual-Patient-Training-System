package com.medsim.api;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.medsim.database.SessionDAO;
import com.medsim.model.EvaluationReport;
import com.medsim.model.Session;
import com.medsim.model.Student;
import com.medsim.service.PDFExporter;
import io.javalin.http.Context;

import java.util.List;

/**
 * HistoryHandler — Handles past session history, leaderboard, and PDF export.
 *
 * Endpoints:
 *   GET  /api/history              → list all past cases for logged-in student
 *   GET  /api/history/{caseId}     → get full detail of one case
 *   GET  /api/leaderboard          → top scores across all students
 *   POST /api/history/export-pdf   → export a case report to PDF
 */
public class HistoryHandler {

    private final AuthHandler authHandler;
    private final SessionDAO sessionDAO;
    private final PDFExporter pdfExporter;
    private final Gson gson;

    
    public HistoryHandler() {
        this.authHandler  = new AuthHandler();
        this.sessionDAO   = new SessionDAO();
        this.pdfExporter  = new PDFExporter();
        this.gson         = new Gson();
    }

    // ── GET /api/history ──────────────────────────────────────────────────
    /**
     * Returns all past sessions for the logged-in student.
     *
     * Response 200: [ { caseId, patientCharacter, department, totalScore, grade, status, submittedAt }, ... ]
     */
    public void getHistory(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        List<Session> sessions = sessionDAO.getCasesForStudent(student.getId());

        JsonArray array = new JsonArray();
        for (Session s : sessions) {
            JsonObject obj = new JsonObject();
            obj.addProperty("caseId",           s.getCaseId());
            obj.addProperty("patientCharacter",  s.getPatientCharacter());
            obj.addProperty("department",        s.getDepartment());
            obj.addProperty("ageGroup",          s.getPatientAgeGroup());
            obj.addProperty("status",            s.getStatus());
            obj.addProperty("totalScore",        s.getTotalScore());
            obj.addProperty("grade",             s.getGrade());
            obj.addProperty("submittedAt",       s.getSubmittedAt() != null ? s.getSubmittedAt().toString() : null);
            array.add(obj);
        }
        ctx.status(200).json(array.toString());
    }

    // ── GET /api/history/{caseId} ─────────────────────────────────────────
    /**
     * Returns full detail of a single past case including evaluation report.
     *
     * Response 200: { full session + evaluation JSON }
     * Response 403: if the case doesn't belong to this student
     * Response 404: if case not found
     */
    public void getCaseDetail(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        int caseId;
        try {
            caseId = Integer.parseInt(ctx.pathParam("caseId"));
        } catch (NumberFormatException e) {
            ctx.status(400).json("{\"error\":\"Invalid caseId.\"}");
            return;
        }

        var sessionOpt = sessionDAO.findCaseById(caseId);
        if (sessionOpt.isEmpty()) {
            ctx.status(404).json("{\"error\":\"Case not found.\"}");
            return;
        }

        Session session = sessionOpt.get();

        // Security check — students can only view their own cases
        if (session.getStudentDbId() != student.getId()) {
            ctx.status(403).json("{\"error\":\"Access denied.\"}");
            return;
        }

        JsonObject response = new JsonObject();
        response.addProperty("caseId",           session.getCaseId());
        response.addProperty("patientCharacter",  session.getPatientCharacter());
        response.addProperty("department",        session.getDepartment());
        response.addProperty("status",            session.getStatus());
        ctx.status(200).json(response.toString());
    }

    // ── DELETE /api/history/{caseId} ─────────────────────────────────────
    public void deleteCase(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        int caseId;
        try {
            caseId = Integer.parseInt(ctx.pathParam("caseId"));
        } catch (NumberFormatException e) {
            ctx.status(400).json("{\"error\":\"Invalid caseId.\"}");
            return;
        }

        boolean deleted = sessionDAO.deleteCase(caseId, student.getId());
        if (!deleted) {
            ctx.status(404).json("{\"error\":\"Case not found or access denied.\"}");
            return;
        }

        ctx.status(200).json("{\"deleted\":true}");
    }

    // ── GET /api/leaderboard ──────────────────────────────────────────────
    /**
     * Returns top 20 scores across all students.
     * Used for the leaderboard screen.
     *
     * Response 200: [ { studentName, universityName, totalScore, grade, department, patientCharacter }, ... ]
     */
    public void getLeaderboard(Context ctx) {
        // Auth not required — leaderboard is public within the app
        List<SessionDAO.LeaderboardEntry> entries = sessionDAO.getLeaderboard(20);

        JsonArray array = new JsonArray();
        for (SessionDAO.LeaderboardEntry entry : entries) {
            JsonObject obj = new JsonObject();
            obj.addProperty("studentName",      entry.studentName());
            obj.addProperty("universityName",   entry.universityName());
            obj.addProperty("totalScore",       entry.totalScore());
            obj.addProperty("grade",            entry.grade());
            obj.addProperty("department",       entry.department());
            obj.addProperty("patientCharacter", entry.patientCharacter());
            array.add(obj);
        }
        ctx.status(200).json(array.toString());
    }

    // ── POST /api/history/export-pdf ─────────────────────────────────────
    /**
     * Streams an evaluation report as a downloadable PDF.
     *
     * Request body:  { "caseId": 5 }
     * Response 200:  application/pdf binary stream (Content-Disposition: attachment)
     */
    public void exportPdf(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);
        if (body == null || !body.has("caseId")) {
            ctx.status(400).json("{\"error\":\"caseId is required.\"}");
            return;
        }

        int caseId = body.get("caseId").getAsInt();

        var sessionOpt = sessionDAO.findCaseById(caseId);
        if (sessionOpt.isEmpty()) {
            ctx.status(404).json("{\"error\":\"Case not found.\"}");
            return;
        }

        Session session = sessionOpt.get();
        if (session.getStudentDbId() != student.getId()) {
            ctx.status(403).json("{\"error\":\"Access denied.\"}");
            return;
        }

        var reportOpt = sessionDAO.getFullEvaluationReport(caseId);
        if (reportOpt.isEmpty()) {
            ctx.status(404).json("{\"error\":\"Evaluation report not found for this case.\"}");
            return;
        }

        try {
            byte[] pdfBytes = pdfExporter.exportToBytes(reportOpt.get(), session, student);
            String filename = "MedSim_Report_Case" + caseId + ".pdf";
            ctx.status(200)
               .contentType("application/pdf")
               .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
               .result(pdfBytes);
            System.out.println("[HistoryHandler] PDF streamed for caseId=" + caseId);
        } catch (Exception e) {
            System.err.println("[HistoryHandler] PDF generation failed: " + e.getMessage());
            ctx.status(500).json("{\"error\":\"PDF generation failed: " + e.getMessage() + "\"}");
        }
    }
}

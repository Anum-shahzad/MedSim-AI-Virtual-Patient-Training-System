package com.medsim.api;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.medsim.model.*;
import com.medsim.service.DrugInteractionChecker;
import com.medsim.service.SessionManager;
import io.javalin.http.Context;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
/**
 * SessionHandler — Handles all consultation session HTTP requests.
 *
 * Uses a ConcurrentHashMap (thread-safe) to store one SessionManager per
 * student database ID. Sessions persist as long as the backend is running.
 *
 */

public class SessionHandler {

    // Static + ConcurrentHashMap = survives all requests, thread-safe
    private static final ConcurrentHashMap<Integer, SessionManager> ACTIVE_SESSIONS
            = new ConcurrentHashMap<>();

    private final AuthHandler authHandler;
    private final Gson gson;

    public SessionHandler() {
        this.authHandler = new AuthHandler();
        this.gson        = new Gson();
    }

    // ── POST /api/session/start ───────────────────────────────────────────
    public void startSession(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);
        if (body == null || !body.has("characterName") || !body.has("department")) {
            ctx.status(400).json("{\"error\":\"characterName and department are required.\"}");
            return;
        }

        String characterName = body.get("characterName").getAsString();
        String department    = body.get("department").getAsString();

        // If student already has an active session, clear it first
        ACTIVE_SESSIONS.remove(student.getId());

        SessionManager manager = new SessionManager();
        Session session = manager.startSession(student, characterName, department);

        // Store in static map keyed by student DB id
        ACTIVE_SESSIONS.put(student.getId(), manager);

        System.out.println("[SessionHandler] Session stored for studentId=" + student.getId()
                + " caseId=" + session.getCaseId()
                + " | Active sessions: " + ACTIVE_SESSIONS.size());

        JsonObject response = new JsonObject();
        response.addProperty("caseId",          session.getCaseId());
        response.addProperty("patientCharacter", session.getPatientCharacter());
        response.addProperty("department",       session.getDepartment());
        response.addProperty("ageGroup",         session.getPatientAgeGroup());
        response.addProperty("status",           session.getStatus());
        ctx.status(200).json(response.toString());
    }

    // ── POST /api/session/message ─────────────────────────────────────────
    public void sendMessage(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        SessionManager manager = getActiveManager(ctx, student);
        if (manager == null) return;

        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);
        if (body == null || !body.has("message")) {
            ctx.status(400).json("{\"error\":\"message field is required.\"}");
            return;
        }

        String message    = body.get("message").getAsString();
        boolean voiceMode = body.has("voiceMode") && body.get("voiceMode").getAsBoolean();

        SessionManager.MessageResult result = manager.sendMessage(message, voiceMode);

        JsonObject response = new JsonObject();
        response.addProperty("patientReply", result.patientReply);

        if (result.audioBytes != null) {
            String base64Audio = java.util.Base64.getEncoder().encodeToString(result.audioBytes);
            response.addProperty("audioBase64", base64Audio);
        } else {
            response.add("audioBase64", null);
        }

        ctx.status(200).json(response.toString());
    }

    // ── POST /api/session/examine ─────────────────────────────────────────
    public void recordExamination(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        SessionManager manager = getActiveManager(ctx, student);
        if (manager == null) return;

        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);
        if (body == null || !body.has("examination")) {
            ctx.status(400).json("{\"error\":\"examination field is required.\"}");
            return;
        }

        manager.recordExamination(body.get("examination").getAsString());
        ctx.status(200).json("{\"recorded\":true}");
    }

    // ── POST /api/session/order-test ──────────────────────────────────────
    public void orderTest(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        SessionManager manager = getActiveManager(ctx, student);
        if (manager == null) return;

        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);
        if (body == null || !body.has("testName")) {
            ctx.status(400).json("{\"error\":\"testName field is required.\"}");
            return;
        }

        manager.orderTest(body.get("testName").getAsString());
        ctx.status(200).json("{\"recorded\":true}");
    }

    // ── POST /api/session/check-drugs ─────────────────────────────────────
    public void checkDrugInteractions(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);
        if (body == null || !body.has("drugs")) {
            ctx.status(400).json("{\"error\":\"drugs array is required.\"}");
            return;
        }

        Prescription prescription = new Prescription();
        JsonArray drugsArray = body.getAsJsonArray("drugs");
        for (int i = 0; i < drugsArray.size(); i++) {
            JsonObject d = drugsArray.get(i).getAsJsonObject();
            prescription.addDrug(new Prescription.DrugEntry(
                d.get("drugName").getAsString(),
                d.get("dose").getAsString(),
                d.get("route").getAsString(),
                d.get("frequency").getAsString(),
                d.get("duration").getAsString()
            ));
        }

        SessionManager manager = ACTIVE_SESSIONS.get(student.getId());
        List<DrugInteractionChecker.InteractionWarning> warnings =
            (manager != null)
                ? manager.checkInteractions(prescription)
                : new com.medsim.service.DrugInteractionChecker().check(prescription);

        JsonObject response = new JsonObject();
        response.addProperty("safe", warnings.isEmpty());
        JsonArray warningsArray = new JsonArray();
        for (DrugInteractionChecker.InteractionWarning w : warnings) {
            JsonObject wObj = new JsonObject();
            wObj.addProperty("drug1",    w.getDrug1());
            wObj.addProperty("drug2",    w.getDrug2());
            wObj.addProperty("severity", w.getSeverity());
            wObj.addProperty("reason",   w.getReason());
            warningsArray.add(wObj);
        }
        response.add("warnings", warningsArray);
        ctx.status(200).json(response.toString());
    }

    // ── POST /api/session/submit ──────────────────────────────────────────
    public void submitSession(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        SessionManager manager = getActiveManager(ctx, student);
        if (manager == null) return;

        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);
        if (body == null) {
            ctx.status(400).json("{\"error\":\"Request body is required.\"}");
            return;
        }

        String primaryDx      = body.has("primaryDiagnosis")      ? body.get("primaryDiagnosis").getAsString()      : "";
        String differentialDx = body.has("differentialDiagnosis") ? body.get("differentialDiagnosis").getAsString() : "";
        String counselling    = body.has("counsellingNotes")       ? body.get("counsellingNotes").getAsString()      : "";

        Prescription prescription = new Prescription();
        prescription.setCounsellingNotes(counselling);
        if (body.has("drugs")) {
            JsonArray drugsArray = body.getAsJsonArray("drugs");
            for (int i = 0; i < drugsArray.size(); i++) {
                JsonObject d = drugsArray.get(i).getAsJsonObject();
                prescription.addDrug(new Prescription.DrugEntry(
                    d.get("drugName").getAsString(),
                    d.get("dose").getAsString(),
                    d.get("route").getAsString(),
                    d.get("frequency").getAsString(),
                    d.get("duration").getAsString()
                ));
            }
        }

        EvaluationReport report = manager.submitSession(
                primaryDx, differentialDx, prescription, counselling);

        // Remove from active sessions after submission
        ACTIVE_SESSIONS.remove(student.getId());
        System.out.println("[SessionHandler] Session removed for studentId=" + student.getId()
                + " | Remaining sessions: " + ACTIVE_SESSIONS.size());

        JsonObject response = new JsonObject();
        response.addProperty("caseId",              report.getCaseId());
        response.addProperty("totalScore",           report.getTotalScore());
        response.addProperty("grade",                report.getGrade());
        response.addProperty("passed",               report.isPassed());
        response.addProperty("scoreHistoryTaking",   report.getScoreHistoryTaking());
        response.addProperty("scorePhysicalExam",    report.getScorePhysicalExam());
        response.addProperty("scoreInvestigation",   report.getScoreInvestigation());
        response.addProperty("scoreDiagnosis",       report.getScoreDiagnosis());
        response.addProperty("scorePrescription",    report.getScorePrescription());
        response.addProperty("aiFeedback",           report.getAiFeedback());
        response.addProperty("modelAnswer",          report.getModelAnswer());
        response.addProperty("correctActions",       report.getCorrectActionsJson());
        response.addProperty("missedActions",        report.getMissedActionsJson());
        ctx.status(200).json(response.toString());
    }

    // ── POST /api/session/generate-report ────────────────────────────────
    public void generateTestReport(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);
        if (body == null || !body.has("testName") || !body.has("department") || !body.has("transcript")) {
            ctx.status(400).json("{\"error\":\"testName, department, and transcript are required.\"}");
            return;
        }

        String testName    = body.get("testName").getAsString();
        String department  = body.get("department").getAsString();
        String transcript  = body.get("transcript").getAsString();

        try {
            com.medsim.service.ReportService reportService = new com.medsim.service.ReportService();
            String report = reportService.generateReport(testName, department, transcript);

            JsonObject response = new JsonObject();
            response.addProperty("report", report);
            ctx.status(200).json(response.toString());
        } catch (Exception e) {
            System.err.println("[SessionHandler] Report generation failed: " + e.getMessage());
            ctx.status(500).json("{\"error\":\"Failed to generate report.\"}");
        }
    }

    // ── GET /api/session/active ───────────────────────────────────────────
    public void getActiveSession(Context ctx) {
        Student student = authHandler.requireAuth(ctx);
        if (student == null) return;

        SessionManager manager = ACTIVE_SESSIONS.get(student.getId());
        if (manager == null || manager.getActiveSession() == null) {
            ctx.status(200).json("{\"active\":false}");
            return;
        }

        Session session = manager.getActiveSession();
        JsonObject response = new JsonObject();
        response.addProperty("active",           true);
        response.addProperty("caseId",           session.getCaseId());
        response.addProperty("patientCharacter", session.getPatientCharacter());
        response.addProperty("department",       session.getDepartment());
        response.addProperty("status",           session.getStatus());
        ctx.status(200).json(response.toString());
    }

    // ── Private helper ────────────────────────────────────────────────────
    private SessionManager getActiveManager(Context ctx, Student student) {
        SessionManager manager = ACTIVE_SESSIONS.get(student.getId());
        if (manager == null) {
            System.err.println("[SessionHandler] No session found for studentId=" + student.getId()
                    + " | Active sessions: " + ACTIVE_SESSIONS.keySet());
            ctx.status(404).json("{\"error\":\"No active session found. Start a session first.\"}");
            return null;
        }
        return manager;
    }
}

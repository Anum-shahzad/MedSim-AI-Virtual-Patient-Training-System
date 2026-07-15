package com.medsim.service;

import com.google.gson.Gson;
import com.medsim.database.SessionDAO;
import com.medsim.model.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * SessionManager — Orchestrates the entire lifecycle of one consultation session.
 *
 * This class is the single coordinator that the API layer talks to.
 */
public class SessionManager {

    private final AIService aiService;
    private final EvaluatorService evaluatorService;
    private final DrugInteractionChecker drugChecker;
    private final SessionDAO sessionDAO;
    private final Gson gson;

    private Session activeSession;
    private Patient activePatient;
    private Student activeStudent;

    public SessionManager() {
        this.aiService        = new AIService();
        this.evaluatorService = new EvaluatorService();
        this.drugChecker      = new DrugInteractionChecker();
        this.sessionDAO       = new SessionDAO();
        this.gson             = new Gson();
    }

    // ── 1. START SESSION ──────────────────────────────────────────────────

    public Session startSession(Student student, String characterName, String department) {
        activePatient = PatientFactory.create(characterName);
        activePatient.setDepartment(department);
        activeStudent = student;

        // Convert the full age label to a MySQL ENUM-safe value
        String ageGroupEnum = toAgeGroupEnum(activePatient.getAgeGroupLabel());

        int caseId = sessionDAO.createCase(
            student.getId(),
            characterName,
            ageGroupEnum,   // ← fixed: uses enum-safe value
            department
        );

        activeSession = new Session();
        activeSession.setCaseId(caseId);
        activeSession.setStudentDbId(student.getId());
        activeSession.setPatientCharacter(characterName);
        activeSession.setPatientAgeGroup(ageGroupEnum);
        activeSession.setDepartment(department);
        activeSession.setStatus("InProgress");
        activeSession.setStartedAt(LocalDateTime.now());

        aiService.initSession(activePatient, student.getLanguagePref());

        System.out.println("[SessionManager] Session started. CaseId=" + caseId
                + " Patient=" + characterName + " Dept=" + department);
        return activeSession;
    }

    /**
     * Converts a human-readable age label to one of the MySQL ENUM values:
     * Child | Teen | YoungAdult | Adult | Senior
     */
    private String toAgeGroupEnum(String ageGroupLabel) {
        if (ageGroupLabel == null) return "Adult";
        String lower = ageGroupLabel.toLowerCase();
        if (lower.contains("child"))  return "Child";
        if (lower.contains("teen"))   return "Teen";
        if (lower.contains("18–35") || lower.contains("young")) return "YoungAdult";
        if (lower.contains("senior") || lower.contains("60"))   return "Senior";
        return "Adult"; // default fallback
    }

    // ── 2. SEND MESSAGE ───────────────────────────────────────────────────

    public static class MessageResult {
        public final String patientReply;
        public final byte[] audioBytes;

        public MessageResult(String patientReply, byte[] audioBytes) {
            this.patientReply = patientReply;
            this.audioBytes   = audioBytes;
        }
    }

    public MessageResult sendMessage(String studentMessage, boolean voiceMode) {
        requireActiveSession();

        String sanitized = studentMessage.replaceAll("<[^>]*>", "").trim();
        if (sanitized.length() > 1000) sanitized = sanitized.substring(0, 1000);

        String patientReply = aiService.sendMessage(sanitized);

        sessionDAO.addTranscriptMessage(activeSession.getCaseId(), "Student", sanitized);
        sessionDAO.addTranscriptMessage(activeSession.getCaseId(), "Patient", patientReply);

        activeSession.addMessage("Student", sanitized);
        activeSession.addMessage("Patient", patientReply);

        byte[] audioBytes = null;
        // Voice synthesis removed (ElevenLabs not used)

        return new MessageResult(patientReply, audioBytes);
    }

    // ── 3. RECORD EXAMINATION ─────────────────────────────────────────────

    public void recordExamination(String examinationName) {
        requireActiveSession();
        activeSession.addExamination(examinationName);
        System.out.println("[SessionManager] Exam recorded: " + examinationName);
    }

    // ── 4. ORDER TEST ─────────────────────────────────────────────────────

    public void orderTest(String testName) {
        requireActiveSession();
        activeSession.addTest(testName);
        System.out.println("[SessionManager] Test ordered: " + testName);
    }

    // ── 5. CHECK DRUG INTERACTIONS ────────────────────────────────────────

    public List<DrugInteractionChecker.InteractionWarning> checkInteractions(Prescription prescription) {
        return drugChecker.check(prescription);
    }

    // ── 6. SUBMIT SESSION ─────────────────────────────────────────────────

    public EvaluationReport submitSession(String primaryDiagnosis,
                                          String differentialDiagnosis,
                                          Prescription prescription,
                                          String counsellingNotes) {
        requireActiveSession();

        activeSession.setPrimaryDiagnosis(primaryDiagnosis);
        activeSession.setDifferentialDiagnosis(differentialDiagnosis);
        activeSession.setCounsellingNotes(counsellingNotes);

        String prescriptionJson = gson.toJson(prescription.getDrugs());
        activeSession.setPrescriptionJson(prescriptionJson);

        sessionDAO.submitCase(
            activeSession.getCaseId(),
            primaryDiagnosis,
            differentialDiagnosis,
            gson.toJson(activeSession.getExaminationsPerformed()),
            gson.toJson(activeSession.getTestsOrdered()),
            prescriptionJson,
            counsellingNotes
        );

        System.out.println("[SessionManager] Case submitted. Running AI evaluation...");

        StringBuilder transcriptBuilder = new StringBuilder();
        for (String[] msg : activeSession.getTranscript()) {
            transcriptBuilder.append(msg[0]).append(": ").append(msg[1]).append("\n");
        }

        EvaluationReport report = evaluatorService.evaluate(
            activePatient,
            activeSession.getDepartment(),
            transcriptBuilder.toString(),
            gson.toJson(activeSession.getExaminationsPerformed()),
            gson.toJson(activeSession.getTestsOrdered()),
            primaryDiagnosis,
            differentialDiagnosis,
            prescriptionJson,
            counsellingNotes,
            activeSession.getCaseId()
        );

        sessionDAO.saveEvaluation(
            activeSession.getCaseId(),
            report.getScoreHistoryTaking(),
            report.getScorePhysicalExam(),
            report.getScoreInvestigation(),
            report.getScoreDiagnosis(),
            report.getScorePrescription(),
            report.getTotalScore(),
            report.getGrade(),
            report.getAiFeedback(),
            report.getModelAnswer(),
            report.getCorrectActionsJson(),
            report.getMissedActionsJson()
        );

        aiService.clearSession();
        activeSession.setStatus("Evaluated");

        System.out.println("[SessionManager] Evaluation complete and saved.");
        return report;
    }

    // ── Getters ───────────────────────────────────────────────────────────

    public Session getActiveSession() { return activeSession; }
    public Patient getActivePatient() { return activePatient; }

    // ── Guard ─────────────────────────────────────────────────────────────

    private void requireActiveSession() {
        if (activeSession == null) {
            throw new RuntimeException("[SessionManager] No active session. Call startSession() first.");
        }
        if (!"InProgress".equals(activeSession.getStatus())) {
            throw new RuntimeException("[SessionManager] Session already submitted.");
        }
    }
}

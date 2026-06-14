package com.medsim.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Session — Represents one active or completed clinical consultation case.
 *
 */
public class Session {

    private int caseId;
    private int studentDbId;
    private String patientCharacter;    // e.g. "Saba Parveen"
    private String patientAgeGroup;     // e.g. "YoungAdult"
    private String department;          // e.g. "General Medicine"
    private String status;              // "InProgress", "Submitted", "Evaluated"
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;

    // In-memory conversation — saved to DB incrementally
    private List<String[]> transcript = new ArrayList<>(); // [sender, message]

    // Student clinical decisions
    private String primaryDiagnosis;
    private String differentialDiagnosis;
    private List<String> examinationsPerformed = new ArrayList<>();
    private List<String> testsOrdered = new ArrayList<>();
    private String prescriptionJson;
    private String counsellingNotes;

    // Evaluation results (filled after submission)
    private double totalScore;
    private String grade;

    public Session() {}

    // Getters and Setters
    public int getCaseId() { return caseId; }
    public void setCaseId(int caseId) { this.caseId = caseId; }

    public int getStudentDbId() { return studentDbId; }
    public void setStudentDbId(int studentDbId) { this.studentDbId = studentDbId; }

    public String getPatientCharacter() { return patientCharacter; }
    public void setPatientCharacter(String patientCharacter) { this.patientCharacter = patientCharacter; }

    public String getPatientAgeGroup() { return patientAgeGroup; }
    public void setPatientAgeGroup(String patientAgeGroup) { this.patientAgeGroup = patientAgeGroup; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public List<String[]> getTranscript() { return transcript; }
    public void addMessage(String sender, String message) { transcript.add(new String[]{sender, message}); }

    public String getPrimaryDiagnosis() { return primaryDiagnosis; }
    public void setPrimaryDiagnosis(String primaryDiagnosis) { this.primaryDiagnosis = primaryDiagnosis; }

    public String getDifferentialDiagnosis() { return differentialDiagnosis; }
    public void setDifferentialDiagnosis(String differentialDiagnosis) { this.differentialDiagnosis = differentialDiagnosis; }

    public List<String> getExaminationsPerformed() { return examinationsPerformed; }
    public void addExamination(String exam) { examinationsPerformed.add(exam); }

    public List<String> getTestsOrdered() { return testsOrdered; }
    public void addTest(String test) { testsOrdered.add(test); }

    public String getPrescriptionJson() { return prescriptionJson; }
    public void setPrescriptionJson(String prescriptionJson) { this.prescriptionJson = prescriptionJson; }

    public String getCounsellingNotes() { return counsellingNotes; }
    public void setCounsellingNotes(String counsellingNotes) { this.counsellingNotes = counsellingNotes; }

    public double getTotalScore() { return totalScore; }
    public void setTotalScore(double totalScore) { this.totalScore = totalScore; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}

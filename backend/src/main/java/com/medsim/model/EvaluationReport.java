package com.medsim.model;

/**
 * EvaluationReport — Holds the AI evaluation scores and feedback for a session.
 *
 * OOP: Encapsulation.
 * Built by EvaluatorService after OpenAI processes the session.
 * Passed to the frontend for display and to SessionDAO for database storage.
 *
 * Max points per dimension:
 *   History Taking       — 25 pts
 *   Physical Exam        — 20 pts
 *   Investigation Order  — 20 pts
 *   Diagnosis Accuracy   — 20 pts
 *   Prescription Quality — 15 pts
 *   TOTAL                — 100 pts
 */
public class EvaluationReport {

    // ── Scores ────────────────────────────────────────────────────────────
    private double scoreHistoryTaking;     
    private double scorePhysicalExam;      
    private double scoreInvestigation;     
    private double scoreDiagnosis;         
    private double scorePrescription;      
    private double totalScore;             

    // ── Grade ─────────────────────────────────────────────────────────────
    private String grade;  // "A", "B", "C", "D", "F"

    // ── AI Feedback ───────────────────────────────────────────────────────
    private String aiFeedback;          // Personalized paragraph from  groq evaluation
    private String modelAnswer;         // Expert reference answer
    private String correctActionsJson;  // JSON array of things done right
    private String missedActionsJson;   // JSON array of things missed or wrong

    // ── Case reference ────────────────────────────────────────────────────
    private int caseId;

    public EvaluationReport() {}

    /**
     * Calculates the grade from the total score.
     * Call this after setting all dimension scores.
     */
    public void calculateGradeFromTotal() {
        totalScore = scoreHistoryTaking + scorePhysicalExam
                   + scoreInvestigation + scoreDiagnosis + scorePrescription;

        if      (totalScore >= 90) grade = "A";
        else if (totalScore >= 80) grade = "B";
        else if (totalScore >= 70) grade = "C";
        else if (totalScore >= 60) grade = "D";
        else                       grade = "F";
    }

    /**
     * Returns true if the student passed (score >= 70).
     */
    public boolean isPassed() { return totalScore >= 70; }

    // ── Getters & Setters ─────────────────────────────────────────────────
    public int getCaseId()                      { return caseId; }
    public void setCaseId(int caseId)           { this.caseId = caseId; }

    public double getScoreHistoryTaking()                  { return scoreHistoryTaking; }
    public void setScoreHistoryTaking(double s)            { this.scoreHistoryTaking = s; }

    public double getScorePhysicalExam()                   { return scorePhysicalExam; }
    public void setScorePhysicalExam(double s)             { this.scorePhysicalExam = s; }

    public double getScoreInvestigation()                  { return scoreInvestigation; }
    public void setScoreInvestigation(double s)            { this.scoreInvestigation = s; }

    public double getScoreDiagnosis()                      { return scoreDiagnosis; }
    public void setScoreDiagnosis(double s)                { this.scoreDiagnosis = s; }

    public double getScorePrescription()                   { return scorePrescription; }
    public void setScorePrescription(double s)             { this.scorePrescription = s; }

    public double getTotalScore()                          { return totalScore; }
    public void setTotalScore(double totalScore)           { this.totalScore = totalScore; }

    public String getGrade()                               { return grade; }
    public void setGrade(String grade)                     { this.grade = grade; }

    public String getAiFeedback()                          { return aiFeedback; }
    public void setAiFeedback(String aiFeedback)           { this.aiFeedback = aiFeedback; }

    public String getModelAnswer()                         { return modelAnswer; }
    public void setModelAnswer(String modelAnswer)         { this.modelAnswer = modelAnswer; }

    public String getCorrectActionsJson()                  { return correctActionsJson; }
    public void setCorrectActionsJson(String json)         { this.correctActionsJson = json; }

    public String getMissedActionsJson()                   { return missedActionsJson; }
    public void setMissedActionsJson(String json)          { this.missedActionsJson = json; }

    @Override
    public String toString() {
        return "EvaluationReport{caseId=" + caseId + ", total=" + totalScore + ", grade='" + grade + "', passed=" + isPassed() + "}";
    }
}

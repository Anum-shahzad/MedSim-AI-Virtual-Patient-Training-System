package com.medsim.database;

import com.medsim.model.Session;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * SessionDAO — Data Access Object for cases, case_transcripts,
 * case_submissions, and evaluation_reports tables.
 */
public class SessionDAO {

    private final DatabaseHandler dbHandler;

    public SessionDAO() {
        this.dbHandler = DatabaseHandler.getInstance();
    }

    // ── LeaderboardEntry — plain class  ──
    public static class LeaderboardEntry {
        private final String studentName;
        private final String universityName;
        private final double totalScore;
        private final String grade;
        private final String department;
        private final String patientCharacter;

        public LeaderboardEntry(String studentName, String universityName,
                                double totalScore, String grade,
                                String department, String patientCharacter) {
            this.studentName      = studentName;
            this.universityName   = universityName;
            this.totalScore       = totalScore;
            this.grade            = grade;
            this.department       = department;
            this.patientCharacter = patientCharacter;
        }

        public String studentName()      { return studentName; }
        public String universityName()   { return universityName; }
        public double totalScore()       { return totalScore; }
        public String grade()            { return grade; }
        public String department()       { return department; }
        public String patientCharacter() { return patientCharacter; }
    }

    
    // ── Create a new case (session) ───────────────────────────────────────
    public int createCase(int studentDbId, String patientCharacter, String ageGroup, String department) {
        String sql = "INSERT INTO cases (student_id, patient_character, patient_age_group, department) VALUES (?, ?, ?, ?)";

        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, studentDbId);
            stmt.setString(2, patientCharacter);
            stmt.setString(3, ageGroup);
            stmt.setString(4, department);
            stmt.executeUpdate();

            ResultSet keys = stmt.getGeneratedKeys();
            if (keys.next()) {
                int caseId = keys.getInt(1);
                System.out.println("[SessionDAO] Case created with id=" + caseId);
                return caseId;
            }
            throw new RuntimeException("[SessionDAO] createCase() returned no generated key.");

        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] createCase() failed: " + e.getMessage(), e);
        }
    }

    // ── Append a transcript message ───────────────────────────────────────
    public void addTranscriptMessage(int caseId, String sender, String message) {
        String sql = "INSERT INTO case_transcripts (case_id, sender, message) VALUES (?, ?, ?)";

        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            stmt.setString(2, sender);
            stmt.setString(3, message);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] addTranscriptMessage() failed: " + e.getMessage(), e);
        }
    }

    // ── Submit a case ─────────────────────────────────────────────────────
    public void submitCase(int caseId, String primaryDiagnosis, String differentialDiagnosis,
                           String examsJson, String testsJson, String prescriptionJson,
                           String counsellingNotes) {

        String subSql    = "INSERT INTO case_submissions (case_id, primary_diagnosis, differential_diagnosis, " +
                           "examinations_performed, tests_ordered, prescription, counselling_notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
        String statusSql = "UPDATE cases SET status = 'Submitted', submitted_at = NOW() WHERE id = ?";

        Connection conn = dbHandler.getConnection();
        try {
            conn.setAutoCommit(false);
            try (PreparedStatement subStmt    = conn.prepareStatement(subSql);
                 PreparedStatement statusStmt = conn.prepareStatement(statusSql)) {

                subStmt.setInt(1, caseId);
                subStmt.setString(2, primaryDiagnosis);
                subStmt.setString(3, differentialDiagnosis);
                subStmt.setString(4, examsJson);
                subStmt.setString(5, testsJson);
                subStmt.setString(6, prescriptionJson);
                subStmt.setString(7, counsellingNotes);
                subStmt.executeUpdate();

                statusStmt.setInt(1, caseId);
                statusStmt.executeUpdate();

                conn.commit();
                System.out.println("[SessionDAO] Case " + caseId + " submitted.");

            } catch (SQLException e) {
                conn.rollback();
                throw new RuntimeException("[SessionDAO] submitCase() rolled back: " + e.getMessage(), e);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] Transaction setup failed: " + e.getMessage(), e);
        }
    }

    
    // ── Save evaluation report ────────────────────────────────────────────
    public void saveEvaluation(int caseId, double historyScore, double examScore,
                               double investigationScore, double diagnosisScore,
                               double prescriptionScore, double totalScore,
                               String grade, String aiFeedback, String modelAnswer,
                               String correctActionsJson, String missedActionsJson) {

        String sql = "INSERT INTO evaluation_reports (case_id, score_history_taking, score_physical_exam, " +
                     "score_investigation, score_diagnosis, score_prescription, total_score, grade, " +
                     "ai_feedback, model_answer, correct_actions, missed_actions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String updateStatus = "UPDATE cases SET status = 'Evaluated' WHERE id = ?";

        Connection conn = dbHandler.getConnection();
        try {
            conn.setAutoCommit(false);
            try (PreparedStatement evalStmt   = conn.prepareStatement(sql);
                 PreparedStatement statusStmt = conn.prepareStatement(updateStatus)) {

                evalStmt.setInt(1, caseId);
                evalStmt.setDouble(2, historyScore);
                evalStmt.setDouble(3, examScore);
                evalStmt.setDouble(4, investigationScore);
                evalStmt.setDouble(5, diagnosisScore);
                evalStmt.setDouble(6, prescriptionScore);
                evalStmt.setDouble(7, totalScore);
                evalStmt.setString(8, grade);
                evalStmt.setString(9, aiFeedback);
                evalStmt.setString(10, modelAnswer);
                evalStmt.setString(11, correctActionsJson);
                evalStmt.setString(12, missedActionsJson);
                evalStmt.executeUpdate();

                statusStmt.setInt(1, caseId);
                statusStmt.executeUpdate();

                conn.commit();
                System.out.println("[SessionDAO] Evaluation saved for case " + caseId + " — Grade: " + grade);

            } catch (SQLException e) {
                conn.rollback();
                throw new RuntimeException("[SessionDAO] saveEvaluation() rolled back: " + e.getMessage(), e);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] Transaction setup failed: " + e.getMessage(), e);
        }
    }

    // ── Delete a case (and its evaluation report) ─────────────────────────
     
    public boolean deleteCase(int caseId, int studentDbId) {
        Connection conn = dbHandler.getConnection(); // get ONCE

        // Ownership check
        String checkSql = "SELECT student_id FROM cases WHERE id = ?";
        try (PreparedStatement check = conn.prepareStatement(checkSql)) {
            check.setInt(1, caseId);
            ResultSet rs = check.executeQuery();
            if (!rs.next() || rs.getInt("student_id") != studentDbId) return false;
        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] deleteCase() check failed: " + e.getMessage(), e);
        }

        // Delete in FK order within a single transaction
        try {
            conn.setAutoCommit(false);
            try {
                try (PreparedStatement del1 = conn.prepareStatement(
                        "DELETE FROM evaluation_reports WHERE case_id = ?")) {
                    del1.setInt(1, caseId);
                    del1.executeUpdate();
                }
                try (PreparedStatement del2 = conn.prepareStatement(
                        "DELETE FROM case_transcripts WHERE case_id = ?")) {
                    del2.setInt(1, caseId);
                    del2.executeUpdate();
                }
                try (PreparedStatement del3 = conn.prepareStatement(
                        "DELETE FROM case_submissions WHERE case_id = ?")) {
                    del3.setInt(1, caseId);
                    del3.executeUpdate();
                }
                try (PreparedStatement del4 = conn.prepareStatement(
                        "DELETE FROM cases WHERE id = ?")) {
                    del4.setInt(1, caseId);
                    del4.executeUpdate();
                }
                conn.commit();
                System.out.println("[SessionDAO] Case " + caseId + " deleted.");
                return true;
            } catch (SQLException e) {
                conn.rollback();
                throw new RuntimeException("[SessionDAO] deleteCase() rolled back: " + e.getMessage(), e);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] deleteCase() transaction setup failed: " + e.getMessage(), e);
        }
    }

    // ── Get all cases for a student (history view) ────────────────────────
    public List<Session> getCasesForStudent(int studentDbId) {
        String sql = "SELECT c.*, er.total_score, er.grade FROM cases c " +
                     "LEFT JOIN evaluation_reports er ON c.id = er.case_id " +
                     "WHERE c.student_id = ? ORDER BY c.started_at DESC";

        List<Session> sessions = new ArrayList<>();

        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, studentDbId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Session session = new Session();
                session.setCaseId(rs.getInt("id"));
                session.setPatientCharacter(rs.getString("patient_character"));
                session.setPatientAgeGroup(rs.getString("patient_age_group"));
                session.setDepartment(rs.getString("department"));
                session.setStatus(rs.getString("status"));

                Timestamp submitted = rs.getTimestamp("submitted_at");
                if (submitted != null) session.setSubmittedAt(submitted.toLocalDateTime());

                double total = rs.getDouble("total_score");
                if (!rs.wasNull()) session.setTotalScore(total);

                String grade = rs.getString("grade");
                if (grade != null) session.setGrade(grade);

                sessions.add(session);
            }
            return sessions;

        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] getCasesForStudent() failed: " + e.getMessage(), e);
        }
    }

    // ── Find a single case by ID ──────────────────────────────────────────
    public Optional<Session> findCaseById(int caseId) {
        String sql = "SELECT * FROM cases WHERE id = ?";

        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                Session session = new Session();
                session.setCaseId(rs.getInt("id"));
                session.setStudentDbId(rs.getInt("student_id"));
                session.setPatientCharacter(rs.getString("patient_character"));
                session.setPatientAgeGroup(rs.getString("patient_age_group"));
                session.setDepartment(rs.getString("department"));
                session.setStatus(rs.getString("status"));
                return Optional.of(session);
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] findCaseById() failed: " + e.getMessage(), e);
        }
    }

    // ── Leaderboard — top N scores across all students ────────────────────
    public List<LeaderboardEntry> getLeaderboard(int limit) {
        String sql = "SELECT s.full_name, s.university_name, er.total_score, er.grade, " +
                     "c.department, c.patient_character " +
                     "FROM evaluation_reports er " +
                     "JOIN cases c ON er.case_id = c.id " +
                     "JOIN students s ON c.student_id = s.id " +
                     "ORDER BY er.total_score DESC LIMIT ?";

        List<LeaderboardEntry> results = new ArrayList<>();

        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, limit);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                results.add(new LeaderboardEntry(
                    rs.getString("full_name"),
                    rs.getString("university_name"),
                    rs.getDouble("total_score"),
                    rs.getString("grade"),
                    rs.getString("department"),
                    rs.getString("patient_character")
                ));
            }
            return results;
        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] getLeaderboard() failed: " + e.getMessage(), e);
        }
    }

    // ── GET full evaluation report by caseId ──────────────────────────────
    public Optional<com.medsim.model.EvaluationReport> getFullEvaluationReport(int caseId) {
        String sql = "SELECT * FROM evaluation_reports WHERE case_id = ?";
        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                com.medsim.model.EvaluationReport report = new com.medsim.model.EvaluationReport();
                report.setCaseId(caseId);
                report.setTotalScore(rs.getDouble("total_score"));
                report.setGrade(rs.getString("grade"));
                report.setScoreHistoryTaking(rs.getDouble("score_history_taking"));
                report.setScorePhysicalExam(rs.getDouble("score_physical_exam"));
                report.setScoreInvestigation(rs.getDouble("score_investigation"));
                report.setScoreDiagnosis(rs.getDouble("score_diagnosis"));
                report.setScorePrescription(rs.getDouble("score_prescription"));
                report.setAiFeedback(rs.getString("ai_feedback"));
                report.setModelAnswer(rs.getString("model_answer"));
                report.setCorrectActionsJson(rs.getString("correct_actions"));
                report.setMissedActionsJson(rs.getString("missed_actions"));
                return Optional.of(report);
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("[SessionDAO] getFullEvaluationReport() failed: " + e.getMessage(), e);
        }
    }
}

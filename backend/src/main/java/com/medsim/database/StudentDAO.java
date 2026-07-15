package com.medsim.database;

import com.medsim.model.Student;
import com.medsim.util.AppConfig;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * StudentDAO — Data Access Object for the students table.
 *
 * OOP: Encapsulation + Separation of Concerns.
 * All SQL queries for students are centralized here.
 * All queries use PreparedStatement  to prevent SQL injection.
 */
public class StudentDAO {

    private final DatabaseHandler dbHandler;

    public StudentDAO() {
        this.dbHandler = DatabaseHandler.getInstance();
    }

    // ── Register a new student ────────────────────────────────────────────
    public boolean register(Student student, String plainPassword) {
        String sql = "INSERT INTO students (student_id, full_name, university_name, year_of_study, language_pref, password_hash) VALUES (?, ?, ?, ?, ?, ?)";

        int saltRounds = AppConfig.getInt("security.bcrypt.rounds");
        String hashedPassword = BCrypt.hashpw(plainPassword, BCrypt.gensalt(saltRounds));
 
        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setString(1, student.getStudentId());
            stmt.setString(2, student.getFullName());
            stmt.setString(3, student.getUniversityName());
            stmt.setInt(4, student.getYearOfStudy());
            stmt.setString(5, student.getLanguagePref());
            stmt.setString(6, hashedPassword);
            stmt.executeUpdate();
            System.out.println("[StudentDAO] Registered: " + student.getStudentId());
            return true;
        } catch (SQLIntegrityConstraintViolationException e) {
            System.err.println("[StudentDAO] student_id already exists: " + student.getStudentId());
            return false;
        } catch (SQLException e) {
            throw new RuntimeException("[StudentDAO] register() failed: " + e.getMessage(), e);
        }
    }

    // ── Find student by student_id string ────────────────────────────────
    public Optional<Student> findByStudentId(String studentId) {
        String sql = "SELECT * FROM students WHERE student_id = ?";
        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setString(1, studentId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) return Optional.of(mapRow(rs));
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("[StudentDAO] findByStudentId() failed: " + e.getMessage(), e);
        }
    }

    // ── Find student by database PK ───────────────────────────────────────
    public Optional<Student> findById(int id) {
        String sql = "SELECT * FROM students WHERE id = ?";
        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) return Optional.of(mapRow(rs));
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("[StudentDAO] findById() failed: " + e.getMessage(), e);
        }
    }

    // ── Authenticate login — handles lockout + BCrypt check ──────────────
    public AuthResult authenticate(String studentId, String plainPassword) {
        Optional<Student> opt = findByStudentId(studentId);
        if (opt.isEmpty()) return AuthResult.NOT_FOUND;

        Student student = opt.get();

        // Check lockout
        if (student.getLockedUntil() != null && student.getLockedUntil().isAfter(LocalDateTime.now())) {
            return AuthResult.LOCKED;
        }

        String storedHash = fetchPasswordHash(student.getId());

        if (BCrypt.checkpw(plainPassword, storedHash)) {
            resetFailedAttempts(student.getId());
            return AuthResult.SUCCESS;
        } else {
            incrementFailedAttempts(student.getId());
            return AuthResult.WRONG_PASSWORD;
        }
    }

    // ── Lockout helpers ───────────────────────────────────────────────────
    private void incrementFailedAttempts(int id) {
        int lockoutSec = AppConfig.getInt("security.lockout.seconds");
        String sql = "UPDATE students SET failed_attempts = failed_attempts + 1, " +
                     "locked_until = CASE WHEN failed_attempts + 1 >= 3 THEN DATE_ADD(NOW(), INTERVAL ? SECOND) ELSE NULL END " +
                     "WHERE id = ?";
        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, lockoutSec);
            stmt.setInt(2, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("[StudentDAO] incrementFailedAttempts() failed: " + e.getMessage(), e);
        }
    }

    private void resetFailedAttempts(int id) {
        String sql = "UPDATE students SET failed_attempts = 0, locked_until = NULL WHERE id = ?";
        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("[StudentDAO] resetFailedAttempts() failed: " + e.getMessage(), e);
        }
    }

    private String fetchPasswordHash(int id) {
        String sql = "SELECT password_hash FROM students WHERE id = ?";
        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) return rs.getString("password_hash");
            throw new RuntimeException("[StudentDAO] No hash found for id=" + id);
        } catch (SQLException e) {
            throw new RuntimeException("[StudentDAO] fetchPasswordHash() failed: " + e.getMessage(), e);
        }
    }

    // ── ResultSet → Student mapper ────────────────────────────────────────
    private Student mapRow(ResultSet rs) throws SQLException {
        Student s = new Student();
        s.setId(rs.getInt("id"));
        s.setStudentId(rs.getString("student_id"));
        s.setFullName(rs.getString("full_name"));
        s.setUniversityName(rs.getString("university_name"));
        s.setYearOfStudy(rs.getInt("year_of_study"));
        s.setLanguagePref(rs.getString("language_pref"));
        s.setFailedAttempts(rs.getInt("failed_attempts"));
        Timestamp locked = rs.getTimestamp("locked_until");
        if (locked != null) s.setLockedUntil(locked.toLocalDateTime());
        s.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return s;
    }

    // ── Auth outcome enum ─────────────────────────────────────────────────
    public enum AuthResult {
        SUCCESS, NOT_FOUND, WRONG_PASSWORD, LOCKED
    }
}

package com.medsim.database;

import com.medsim.model.Student;
import com.medsim.util.AppConfig;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * SessionTokenDAO — Manages login session tokens in the session_tokens table.
 */

public class SessionTokenDAO {

    private final DatabaseHandler dbHandler;
    private final StudentDAO studentDAO;

    
    public SessionTokenDAO() {
        this.dbHandler  = DatabaseHandler.getInstance();
        this.studentDAO = new StudentDAO();
    }

    /**
     * Creates a new UUID session token for a student and saves it to DB.
     *
     * @param studentDbId the student's database primary key
     * @return the generated token string
     */
    public String createToken(int studentDbId) {
        String token = UUID.randomUUID().toString();
        int expiryHours = AppConfig.getInt("security.token.expiry.hours");

        String sql = "INSERT INTO session_tokens (student_id, token, expires_at) VALUES (?, ?, ?)";

        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setInt(1, studentDbId);
            stmt.setString(2, token);
            stmt.setTimestamp(3, Timestamp.valueOf(LocalDateTime.now().plusHours(expiryHours)));
            stmt.executeUpdate();
            return token;
        } catch (SQLException e) {
            throw new RuntimeException("[SessionTokenDAO] createToken() failed: " + e.getMessage(), e);
        }
    }

    /**
     * Validates a token and returns the associated Student if valid and not expired.
     *
     * @param token the token string from the Authorization header
     * @return Optional<Student> — empty if token is invalid or expired
     */
    public Optional<Student> validateToken(String token) {
        String sql = "SELECT student_id FROM session_tokens " +
                     "WHERE token = ? AND is_active = TRUE AND expires_at > NOW()";

        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setString(1, token);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                int studentId = rs.getInt("student_id");
                return studentDAO.findById(studentId);
            }
            return Optional.empty();

        } catch (SQLException e) {
            throw new RuntimeException("[SessionTokenDAO] validateToken() failed: " + e.getMessage(), e);
        }
    }

    /**
     * Invalidates a token (logout). Sets is_active = FALSE.
     *
     * @param token the token to invalidate
     */
    public void invalidateToken(String token) {
        String sql = "UPDATE session_tokens SET is_active = FALSE WHERE token = ?";

        try (PreparedStatement stmt = dbHandler.getConnection().prepareStatement(sql)) {
            stmt.setString(1, token);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("[SessionTokenDAO] invalidateToken() failed: " + e.getMessage(), e);
        }
    }
}

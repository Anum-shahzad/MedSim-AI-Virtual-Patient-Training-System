package com.medsim.api;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.medsim.database.SessionTokenDAO;
import com.medsim.database.StudentDAO;
import com.medsim.model.Student;
import io.javalin.http.Context;
import java.util.Optional;

/**
 * AuthHandler — Handles all authentication-related HTTP requests.
 * 
 * Endpoints:
 *   POST /api/auth/login   → validate credentials, return session token
 *   POST /api/auth/signup  → register new student account
 *   POST /api/auth/logout  → invalidate session token
 *   GET  /api/auth/me      → return current student profile from token
 */
public class AuthHandler {

    private final StudentDAO studentDAO;
    private final SessionTokenDAO tokenDAO;
    private final Gson gson;

    public AuthHandler() {
        this.studentDAO = new StudentDAO();
        this.tokenDAO   = new SessionTokenDAO();
        this.gson       = new Gson();
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────
    /**
     * Authenticates a student.
     *
     * Request body:  { "studentId": "0874", "password": "abc123" }
     * Response 200:  { "token": "uuid-token", "student": { ...profile... } }
     * Response 401:  { "error": "Invalid credentials" }
     * Response 423:  { "error": "Account locked. Try again in 60 seconds." }
     * Response 404:  { "error": "Student ID not found" }
     */
    public void login(Context ctx) {
        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);

        if (body == null || !body.has("studentId") || !body.has("password")) {
            ctx.status(400).json("{\"error\":\"studentId and password are required.\"}");
            return;
        }

        String studentId = body.get("studentId").getAsString().trim();
        String password  = body.get("password").getAsString();

        // Enforce input length limits
        if (studentId.length() > 50 || password.length() > 128) {
            ctx.status(400).json("{\"error\":\"Input exceeds maximum length.\"}");
            return;
        }

        StudentDAO.AuthResult result = studentDAO.authenticate(studentId, password);

        switch (result) {
            case SUCCESS -> {
                Optional<Student> studentOpt = studentDAO.findByStudentId(studentId);
                if (studentOpt.isEmpty()) {
                    ctx.status(500).json("{\"error\":\"Authentication error.\"}");
                    return;
                }
                Student student = studentOpt.get();
                String token = tokenDAO.createToken(student.getId());

                JsonObject response = new JsonObject();
                response.addProperty("token", token);
                response.add("student", studentToJson(student));
                ctx.status(200).json(response.toString());
            }
            case LOCKED      -> ctx.status(423).json("{\"error\":\"Account locked after 3 failed attempts. Try again in 60 seconds.\"}");
            case WRONG_PASSWORD -> ctx.status(401).json("{\"error\":\"Incorrect password.\"}");
            case NOT_FOUND   -> ctx.status(404).json("{\"error\":\"Student ID not found.\"}");
        }
    }

    // ── POST /api/auth/signup ─────────────────────────────────────────────
    /**
     * Registers a new student account.
     *
     * Request body:  { "studentId":"0874", "fullName":"Anum", "universityName":"...",
     *                  "yearOfStudy":2, "languagePref":"English", "password":"..." }
     * Response 201:  { "token": "...", "student": {...} }
     * Response 409:  { "error": "Student ID already registered." }
     */
    public void signup(Context ctx) {
        JsonObject body = gson.fromJson(ctx.body(), JsonObject.class);

        if (body == null) {
            ctx.status(400).json("{\"error\":\"Request body is required.\"}");
            return;
        }

        // Validate all required fields exist
        String[] required = {"studentId","fullName","universityName","yearOfStudy","languagePref","password"};
        for (String field : required) {
            if (!body.has(field) || body.get(field).getAsString().isBlank()) {
                ctx.status(400).json("{\"error\":\"Missing required field: " + field + "\"}");
                return;
            }
        }

        String password = body.get("password").getAsString();
        if (password.length() < 6) {
            ctx.status(400).json("{\"error\":\"Password must be at least 6 characters.\"}");
            return;
        }

        Student student = new Student(
            body.get("studentId").getAsString().trim(),
            body.get("fullName").getAsString().trim(),
            body.get("universityName").getAsString().trim(),
            body.get("yearOfStudy").getAsInt(),
            body.get("languagePref").getAsString().trim()
        );

        boolean registered = studentDAO.register(student, password);
        if (!registered) {
            ctx.status(409).json("{\"error\":\"Student ID already registered.\"}");
            return;
        }

        // Auto-login after successful registration
        Optional<Student> created = studentDAO.findByStudentId(student.getStudentId());
        if (created.isEmpty()) {
            ctx.status(500).json("{\"error\":\"Registration succeeded but login failed.\"}");
            return;
        }

        String token = tokenDAO.createToken(created.get().getId());
        JsonObject response = new JsonObject();
        response.addProperty("token", token);
        response.add("student", studentToJson(created.get()));
        ctx.status(201).json(response.toString());
    }

    // ── POST /api/auth/logout ─────────────────────────────────────────────
    /**
     * Invalidates the student's session token.
     *
     * Header:       Authorization: Bearer <token>
     * Response 200: { "message": "Logged out successfully." }
     */
    public void logout(Context ctx) {
        String token = extractToken(ctx);
        if (token != null) {
            tokenDAO.invalidateToken(token);
        }
        ctx.status(200).json("{\"message\":\"Logged out successfully.\"}");
    }

    // ── GET /api/auth/me ──────────────────────────────────────────────────
    /**
     * Returns the current student's profile using their session token.
     *
     * Header:       Authorization: Bearer <token>
     * Response 200: { student profile JSON }
     * Response 401: { "error": "Invalid or expired session." }
     */
    public void me(Context ctx) {
        Student student = requireAuth(ctx);
        if (student == null) return;
        ctx.status(200).json(studentToJson(student).toString());
    }

    // ── Shared auth utilities (used by other handlers too) ────────────────

    /**
     * Validates the Bearer token from the Authorization header.
     * Returns the authenticated Student or null (and sets 401 response) if invalid.
     * Other handlers call this to protect their endpoints.
     */
    Student requireAuth(Context ctx) {
        String token = extractToken(ctx);
        if (token == null) {
            ctx.status(401).json("{\"error\":\"Authorization token required.\"}");
            return null;
        }

        Optional<Student> student = tokenDAO.validateToken(token);
        if (student.isEmpty()) {
            ctx.status(401).json("{\"error\":\"Invalid or expired session. Please log in again.\"}");
            return null;
        }
        return student.get();
    }

    String extractToken(Context ctx) {
        String authHeader = ctx.header("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return authHeader.substring(7).trim();
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private JsonObject studentToJson(Student student) {
        JsonObject obj = new JsonObject();
        obj.addProperty("id",             student.getId());
        obj.addProperty("studentId",      student.getStudentId());
        obj.addProperty("fullName",       student.getFullName());
        obj.addProperty("universityName", student.getUniversityName());
        obj.addProperty("yearOfStudy",    student.getYearOfStudy());
        obj.addProperty("languagePref",   student.getLanguagePref());
        return obj;
    }
}

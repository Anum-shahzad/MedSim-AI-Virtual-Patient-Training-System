package com.medsim.api;

import io.javalin.Javalin;

/**
 * ApiServer — Starts the Javalin HTTP server and registers all API routes.
 * CORS is handled manually via before/after filters — bypasses Javalin's
 * broken anyHost() in version 6.1.3.
 */
public class ApiServer {

    private static Javalin app;

    public static void start(int port) {
        app = Javalin.create(config -> {
            config.bundledPlugins.enableDevLogging();
        });

        // ── Manual CORS — handles ALL preflight OPTIONS requests ──────────
        app.before(ctx -> {
            ctx.header("Access-Control-Allow-Origin",  "*");
            ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });

        // Respond 200 to all OPTIONS preflight requests immediately
        app.options("/*", ctx -> ctx.status(200));

        // ── Auth routes ───────────────────────────────────────────────────
        AuthHandler authHandler = new AuthHandler();
        app.post("/api/auth/login",  authHandler::login);
        app.post("/api/auth/signup", authHandler::signup);
        app.post("/api/auth/logout", authHandler::logout);
        app.get ("/api/auth/me",     authHandler::me);

        // ── Session routes ────────────────────────────────────────────────
        SessionHandler sessionHandler = new SessionHandler();
        app.post("/api/session/start",       sessionHandler::startSession);
        app.post("/api/session/message",     sessionHandler::sendMessage);
        app.post("/api/session/examine",     sessionHandler::recordExamination);
        app.post("/api/session/order-test",  sessionHandler::orderTest);
        app.post("/api/session/check-drugs",      sessionHandler::checkDrugInteractions);
        app.post("/api/session/submit",           sessionHandler::submitSession);
        app.post("/api/session/generate-report",  sessionHandler::generateTestReport);
        app.get ("/api/session/active",           sessionHandler::getActiveSession);

        // ── History routes ────────────────────────────────────────────────
        HistoryHandler historyHandler = new HistoryHandler();
        app.get ("/api/history",             historyHandler::getHistory);
        app.get ("/api/history/{caseId}",    historyHandler::getCaseDetail);
        app.delete("/api/history/{caseId}",  historyHandler::deleteCase);
        app.get ("/api/leaderboard",         historyHandler::getLeaderboard);
        app.post("/api/history/export-pdf",  historyHandler::exportPdf);

        // ── Health check ──────────────────────────────────────────────────
        app.get("/api/health", ctx -> ctx.json("{\"status\":\"ok\",\"app\":\"MedSim\"}"));

        // ── Global error handlers ─────────────────────────────────────────
        app.exception(IllegalArgumentException.class, (e, ctx) ->
            ctx.status(400).json("{\"error\":\"" + e.getMessage().replace("\"", "'") + "\"}"));

        app.exception(SecurityException.class, (e, ctx) ->
            ctx.status(401).json("{\"error\":\"" + e.getMessage().replace("\"", "'") + "\"}"));

        app.exception(Exception.class, (e, ctx) -> {
            System.err.println("[ApiServer] Unhandled error: " + e.getMessage());
            ctx.status(500).json("{\"error\":\"An internal server error occurred.\"}");
        });

        app.start(port);
        System.out.println("[ApiServer] MedSim backend running on http://localhost:" + port);
    }

    public static void stop() {
        if (app != null) app.stop();
    }
}

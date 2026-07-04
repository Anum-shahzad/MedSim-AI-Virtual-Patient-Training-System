package com.medsim;

import com.medsim.api.ApiServer;
import com.medsim.database.DatabaseHandler;
import com.medsim.util.AppConfig;

/**
 * Main — Application entry point.
 *
 * Startup sequence:
 *  1. Load config.properties
 *  2. Connect to MySQL
 *  3. Start Javalin REST API server
 *  4. Register shutdown hook for clean exit
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("===========================================");
        System.out.println("  MedSim — AI Virtual Patient Training");
        System.out.println("  OOP Semester Final Project v1.0");
        System.out.println("===========================================");

        // Step 1: Load all config from config.properties
        AppConfig.load();

        // Step 2: Initialize database connection (Singleton)
        DatabaseHandler dbHandler = DatabaseHandler.getInstance();

        // Step 3: Start Javalin REST API server
        int port = AppConfig.getInt("server.port");
        ApiServer.start(port);

        // Step 4: Register shutdown hook —  
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\n[Main] Shutdown signal received. Cleaning up...");
            ApiServer.stop();
            dbHandler.close();
            System.out.println("[Main] MedSim shut down cleanly.");
        }));

        System.out.println("[Main] MedSim backend is fully running.");
        System.out.println("[Main] API available at http://localhost:" + port);
        System.out.println("[Main] Health check: http://localhost:" + port + "/api/health");
    }
}

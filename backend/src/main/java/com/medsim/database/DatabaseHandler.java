package com.medsim.database;

import com.medsim.util.AppConfig;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DatabaseHandler — Singleton MySQL connection manager.
 *
 * Only one database connection instance exists throughout the application lifecycle.
 *
 * Usage:
 *   Connection conn = DatabaseHandler.getInstance().getConnection();
 */
public class DatabaseHandler {

    private static DatabaseHandler instance;
    private Connection connection;

    private DatabaseHandler() {
        this.connection = createConnection();
    }

    private static Connection createConnection() {
        try {
            String host     = AppConfig.get("db.host");
            String port     = AppConfig.getOrDefault("db.port", "3306");
            String dbName   = AppConfig.get("db.name");
            String user     = AppConfig.get("db.user");
            String password = AppConfig.get("db.password");

            String url = String.format(
                "jdbc:mysql://%s:%s/%s?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8",
                host, port, dbName
            );

            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("[DatabaseHandler] Connected to MySQL: " + dbName);
            return conn;

        } catch (SQLException e) {
            throw new RuntimeException(
                "[DatabaseHandler] Failed to connect to MySQL. " +
                "Check config.properties db.* settings.\nError: " + e.getMessage(), e
            );
        }
    }

    public static synchronized DatabaseHandler getInstance() {
        if (instance == null) {
            instance = new DatabaseHandler();
        }
        return instance;
    }

     
    public synchronized Connection getConnection() {
        try {
            if (connection == null || !connection.isValid(5)) {
                System.out.println("[DatabaseHandler] Connection lost — reconnecting...");
                try {
                    if (connection != null) connection.close();
                } catch (SQLException ignored) {}
                connection = createConnection();
            }
        } catch (SQLException e) {
            System.err.println("[DatabaseHandler] Connection check failed — reconnecting: " + e.getMessage());
            connection = createConnection();
        }
        return connection;
    }

    public synchronized void close() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("[DatabaseHandler] Connection closed.");
            }
        } catch (SQLException e) {
            System.err.println("[DatabaseHandler] Error closing: " + e.getMessage());
        }
    }
}

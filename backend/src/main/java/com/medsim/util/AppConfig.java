package com.medsim.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * AppConfig — Singleton configuration loader.
 *
 * Loads all settings from config.properties at application startup.
 * No API keys or passwords are ever hardcoded in source files.
 *
 * Usage:
 *   String dbHost = AppConfig.get("db.host");
 */
public class AppConfig {

    private static final String CONFIG_FILE = "config.properties";
    private static final Properties properties = new Properties();
    private static boolean loaded = false;

    // Private constructor — this is a utility class, not instantiated
    private AppConfig() {}

    /**
     * Loads config.properties from the project root.
     * Called once at application startup from Main.java.
     *
     * @throws RuntimeException if config.properties is missing or unreadable
     */
    public static void load() {
        if (loaded) return;

        // Try loading from filesystem first (project root when running from IDE or JAR dir)
        try (InputStream fileStream = new FileInputStream(CONFIG_FILE)) {
            properties.load(fileStream);
            loaded = true;
            System.out.println("[AppConfig] Configuration loaded from " + CONFIG_FILE);
            return;
        } catch (IOException ignored) {
            // File not found in working directory — try classpath
        }

        // Fallback: load from classpath (useful during tests)
        try (InputStream classpathStream =
                     AppConfig.class.getClassLoader().getResourceAsStream(CONFIG_FILE)) {
            if (classpathStream == null) {
                throw new RuntimeException(
                    "[AppConfig] FATAL: config.properties not found. " +
                    "Create it in the project root directory. " +
                    "See config.properties.template for reference."
                );
            }
            properties.load(classpathStream);
            loaded = true;
            System.out.println("[AppConfig] Configuration loaded from classpath.");
        } catch (IOException e) {
            throw new RuntimeException("[AppConfig] Failed to load config.properties: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieves a configuration value by key.
     *
     * @param key the property key (e.g. "db.host")
     * @return the property value
     * @throws RuntimeException if the key is missing from config.properties
     */
    public static String get(String key) {
        if (!loaded) {
            throw new RuntimeException("[AppConfig] Configuration not loaded. Call AppConfig.load() first.");
        }
        String value = properties.getProperty(key);
        if (value == null || value.isBlank()) {
            throw new RuntimeException("[AppConfig] Missing required config key: " + key);
        }
        return value.trim();
    }

    /**
     * Retrieves an integer configuration value.
     *
     * @param key the property key
     * @return the integer value
     */
    public static int getInt(String key) {
        return Integer.parseInt(get(key));
    }

    /**
     * Retrieves a configuration value with a default fallback.
     *
     * @param key          the property key
     * @param defaultValue value returned if key is not found
     * @return the property value or defaultValue
     */
    public static String getOrDefault(String key, String defaultValue) {
        if (!loaded) return defaultValue;
        return properties.getProperty(key, defaultValue).trim();
    }
}

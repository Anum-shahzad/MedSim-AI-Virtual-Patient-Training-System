package com.medsim.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.medsim.util.AppConfig;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * ReportService — Generates a contextual diagnostic test report using Groq AI.
 *
 * Called when a student orders a test during a consultation session.
 * Uses the full conversation transcript to produce a clinically relevant report
 * instead of a generic one-size-fits-all result.
 */
public class ReportService {

    private final HttpClient httpClient;
    private final Gson gson;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

    public ReportService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.gson    = new Gson();
        this.apiKey  = AppConfig.get("groq.api.key");
        this.apiUrl  = AppConfig.get("groq.api.url");
        this.model   = AppConfig.get("groq.model");
    }

    /**
     * Generates a test report based on conversation context.
     *
     * @param testName   The name of the ordered test (e.g. "Dental X-Ray")
     * @param department The patient's department (e.g. "Dentistry")
     * @param transcript The full conversation so far as a plain text string
     * @return A formatted report string ready to display to the student
     */
    public String generateReport(String testName, String department, String transcript) {
        String prompt = buildPrompt(testName, department, transcript);

        JsonObject userMessage = new JsonObject();
        userMessage.addProperty("role", "user");
        userMessage.addProperty("content", prompt);

        JsonObject systemMessage = new JsonObject();
        systemMessage.addProperty("role", "system");
        systemMessage.addProperty("content",
            "You are a medical diagnostic reporting system for a patient simulation platform used by medical students. " +
            "You generate realistic, concise, and clinically accurate test reports. " +
            "Always respond only with the report — no preamble, no explanation, no markdown formatting, no asterisks. " +
            "Use plain text with clear section labels. Keep reports professional and educational."
        );

        JsonArray messages = new JsonArray();
        messages.add(systemMessage);
        messages.add(userMessage);

        JsonObject body = new JsonObject();
        body.addProperty("model", model);
        body.addProperty("max_tokens", 500);
        body.addProperty("temperature", 0.4); // Lower temperature = more consistent medical text
        body.add("messages", messages);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                System.err.println("[ReportService] Groq returned status " + response.statusCode());
                return fallbackReport(testName, department);
            }

            JsonObject json = gson.fromJson(response.body(), JsonObject.class);
            return json.getAsJsonArray("choices")
                       .get(0).getAsJsonObject()
                       .getAsJsonObject("message")
                       .get("content").getAsString()
                       .trim();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return fallbackReport(testName, department);
        } catch (Exception e) {
            System.err.println("[ReportService] Error generating report: " + e.getMessage());
            return fallbackReport(testName, department);
        }
    }

    private String buildPrompt(String testName, String department, String transcript) {
        return "A medical student is consulting a simulated patient in the " + department + " department.\n\n" +
               "CONVERSATION TRANSCRIPT:\n" +
               (transcript.isBlank() ? "(No conversation yet — patient has not described symptoms.)" : transcript) +
               "\n\nTEST ORDERED: " + testName + "\n\n" +
               "Generate a formal diagnostic test report for this test. " +
               "Base the FINDINGS and IMPRESSION strictly on the symptoms and complaints described by the patient in the conversation above. " +
               "If the patient mentioned a specific location, severity, or duration of symptoms, reflect that in the findings. " +
               "Do NOT write generic normal findings if the patient described clear symptoms.\n\n" +
               "Use this exact structure:\n\n" +
               "TEST: " + testName + "\n" +
               "DEPARTMENT: " + department + "\n" +
               "INDICATION: (1 sentence — why this test was clinically indicated based on the conversation)\n\n" +
               "FINDINGS:\n" +
               "(3 to 5 specific bullet points directly relevant to the patient's reported symptoms. " +
               "Use clinical terminology. Phrase findings as 'consistent with', 'suggestive of', or 'no evidence of'. " +
               "Be specific to the anatomy involved based on what the patient said.)\n\n" +
               "IMPRESSION:\n" +
               "(1 to 2 sentences. Summarise what the findings suggest clinically. " +
               "Do not give a definitive diagnosis — say 'findings are consistent with' or 'cannot exclude'.)\n\n" +
               "RECOMMENDATION:\n" +
               "(1 sentence advising the clinician on the next step based on this report.)\n\n" +
               "IMPORTANT: Write in plain text only. No asterisks, no bold, no markdown. " +
               "Do not add any text outside the report structure above.";
    }

    private String fallbackReport(String testName, String department) {
        return "TEST: " + testName + "\n" +
               "DEPARTMENT: " + department + "\n" +
               "INDICATION: Ordered by consulting clinician based on patient presentation.\n\n" +
               "FINDINGS:\n" +
               "- Report generation temporarily unavailable.\n" +
               "- Please review patient history and physical examination findings manually.\n\n" +
               "IMPRESSION:\n" +
               "Unable to generate AI report at this time. Clinical correlation is recommended.\n\n" +
               "RECOMMENDATION:\n" +
               "Proceed with clinical assessment based on patient history and examination findings.";
    }
}

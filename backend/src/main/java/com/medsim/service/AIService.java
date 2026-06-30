package com.medsim.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.medsim.model.Patient;
import com.medsim.util.AppConfig;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * AIService — Handles all communication with Groq AI for patient dialogue.
 */
public class AIService {

    private final HttpClient httpClient;
    private final Gson gson;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

    private final List<JsonObject> conversationHistory = new ArrayList<>();

    public AIService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.gson   = new Gson();

        
        this.apiKey = AppConfig.get("groq.api.key");
        this.apiUrl = AppConfig.get("groq.api.url");
        this.model  = AppConfig.get("groq.model");

        System.out.println("[AIService] Initialized with model: " + this.model);
        System.out.println("[AIService] API URL: " + this.apiUrl);
    }

    public void initSession(Patient patient, String studentLanguage) {
        conversationHistory.clear();

        JsonObject systemMessage = new JsonObject();
        systemMessage.addProperty("role", "system");
        systemMessage.addProperty("content", patient.buildFullPrompt(studentLanguage));
        conversationHistory.add(systemMessage);

        System.out.println("[AIService] Session initialized for patient: " + patient.getCharacterName());
    }


    public String sendMessage(String studentMessage) {
        if (conversationHistory.isEmpty()) {
            throw new RuntimeException("[AIService] Session not initialized. Call initSession() first.");
        }


        
        JsonObject userMessage = new JsonObject();
        userMessage.addProperty("role", "user");
        userMessage.addProperty("content", studentMessage);
        conversationHistory.add(userMessage);

        String requestBody = buildRequestBody();

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            //  Debug logs
            System.out.println("[AIService] Response status: " + response.statusCode());
            System.out.println("[AIService] Response body: " + response.body());

            if (response.statusCode() != 200) {
                //  Production-safe fallback instead of crash
                return "The AI service is temporarily unavailable. Please try again.";
            }

            String patientReply = extractReplyFromResponse(response.body());

            JsonObject assistantMessage = new JsonObject();
            assistantMessage.addProperty("role", "assistant");
            assistantMessage.addProperty("content", patientReply);
            conversationHistory.add(assistantMessage);

            return patientReply;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("[AIService] Request interrupted.", e);
        } catch (Exception e) {
            throw new RuntimeException("[AIService] Failed to contact Groq API: " + e.getMessage(), e);
        }
    }

    public List<JsonObject> getConversationHistory() {
        return new ArrayList<>(conversationHistory);
    }

    public void clearSession() {
        conversationHistory.clear();
        System.out.println("[AIService] Session cleared.");
    }

    private String buildRequestBody() {
        JsonObject body = new JsonObject();
        body.addProperty("model", model);
        body.addProperty("max_tokens", 300);
        body.addProperty("temperature", 0.8);

        JsonArray messages = new JsonArray();
        for (JsonObject msg : conversationHistory) {
            messages.add(msg);
        }
        body.add("messages", messages);

        System.out.println("[AIService] Sending request with model: " + model);
        return gson.toJson(body);
    }

    private String extractReplyFromResponse(String responseBody) {
        JsonObject json = gson.fromJson(responseBody, JsonObject.class);
        try {
            return json.getAsJsonArray("choices")
                       .get(0).getAsJsonObject()
                       .getAsJsonObject("message")
                       .get("content").getAsString()
                       .trim();
        } catch (Exception e) {
            throw new RuntimeException("[AIService] Failed to parse Groq response: " + responseBody, e);
        }
    }
}
package com.medsim.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.medsim.model.EvaluationReport;
import com.medsim.model.Patient;
import com.medsim.util.AppConfig;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * EvaluatorService — Sends the complete session data to Groq for strict evaluation.
 *
 * Uses the same Groq API that powers patient dialogue (already configured & working).
 *
 * How evaluation works:
 *  1. After the student clicks Submit, all session data is compiled into one detailed prompt.
 *  2. The prompt is sent to Groq with strict instructions to score each dimension.
 *  3. Groq returns a JSON object with scores, feedback, correct/missed actions.
 *  4. This class parses that JSON into an EvaluationReport object.
 *  5. The report is displayed to the student and saved to the database.
 */
public class EvaluatorService {

    private final HttpClient httpClient;
    private final Gson gson;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

    public EvaluatorService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.gson   = new Gson();
        // Use Groq keys — same API already working for patient dialogue
        this.apiKey = AppConfig.get("groq.api.key");
        this.apiUrl = AppConfig.get("groq.api.url");
        this.model  = AppConfig.get("groq.model");

        System.out.println("[EvaluatorService] Initialized with Groq model: " + this.model);
    }

    /**
     * Evaluates a completed session and returns a scored EvaluationReport.
     *
     * @param patient                the patient character used in this session
     * @param department             e.g. "General Medicine"
     * @param conversationTranscript the full student-patient dialogue
     * @param examinationsPerformed  list of physical exams the student performed
     * @param testsOrdered           list of diagnostic tests ordered
     * @param primaryDiagnosis       student's primary diagnosis
     * @param differentialDiagnosis  student's differential diagnoses
     * @param prescriptionJson       JSON string of the student's prescription
     * @param counsellingNotes       student's counselling notes
     * @param caseId                 database case ID (stored in the report)
     * @return fully populated EvaluationReport
     */
    public EvaluationReport evaluate(
            Patient patient,
            String department,
            String conversationTranscript,
            String examinationsPerformed,
            String testsOrdered,
            String primaryDiagnosis,
            String differentialDiagnosis,
            String prescriptionJson,
            String counsellingNotes,
            int caseId) {

        String prompt = buildEvaluationPrompt(
            patient, department, conversationTranscript,
            examinationsPerformed, testsOrdered,
            primaryDiagnosis, differentialDiagnosis,
            prescriptionJson, counsellingNotes
        );

        String responseJson = callGroq(prompt);
        return parseEvaluationResponse(responseJson, caseId);
    }

    // ── Private: Build the evaluation prompt ──────────────────────────────

    private String buildEvaluationPrompt(
            Patient patient, String department, String transcript,
            String exams, String tests,
            String primaryDx, String differentialDx,
            String prescription, String counselling) {

        return """
            You are a strict medical education evaluator. A medical student has just completed a virtual patient consultation.
            Evaluate their performance STRICTLY based on what they actually did. Do not give marks for things they did not do.
            
            === PATIENT INFORMATION ===
            Patient Name: %s
            Patient Type: %s
            Age Group: %s
            Department: %s
            
            === STUDENT'S CONSULTATION TRANSCRIPT ===
            %s
            
            === PHYSICAL EXAMINATIONS PERFORMED ===
            %s
            
            === DIAGNOSTIC TESTS ORDERED ===
            %s
            
            === STUDENT'S DIAGNOSIS ===
            Primary: %s
            Differential: %s
            
            === STUDENT'S PRESCRIPTION ===
            %s
            
            === COUNSELLING NOTES ===
            %s
            
            === SCORING RUBRIC (Total: 100 points) ===
            1. History Taking (max 25 pts): Were relevant questions asked? Was the sequence logical? Was communication appropriate for this patient type?
            2. Physical Examination (max 20 pts): Were correct body areas examined? Were steps clinically appropriate for the department?
            3. Investigation Ordering (max 20 pts): Were appropriate tests ordered? Were unnecessary tests avoided? Were results interpreted correctly?
            4. Diagnosis Accuracy (max 20 pts): Is the primary diagnosis correct? Are differentials reasonable?
            5. Prescription Quality (max 15 pts): Are drugs appropriate? Are doses correct for this patient's age? Are there any harmful drug interactions?
            
            === YOUR RESPONSE FORMAT ===
            You MUST respond with ONLY a valid JSON object. No explanation text before or after. No markdown. Just the JSON.
            
            {
              "score_history_taking": <number 0-25>,
              "score_physical_exam": <number 0-20>,
              "score_investigation": <number 0-20>,
              "score_diagnosis": <number 0-20>,
              "score_prescription": <number 0-15>,
              "ai_feedback": "<2-3 sentence personalized feedback paragraph for this specific student>",
              "model_answer": "<brief expert summary of what the ideal approach for this case would have been>",
              "correct_actions": ["<action 1>", "<action 2>", ...],
              "missed_actions": ["<missed item 1>", "<missed item 2>", ...]
            }
            """.formatted(
                patient.getCharacterName(), patient.getPersonalityType(), patient.getAgeGroupLabel(), department,
                transcript, exams, tests,
                primaryDx, differentialDx,
                prescription, counselling
            );
    }

    // ── Private: Call Groq API ────────────────────────────────────────────

    private String callGroq(String prompt) {
        JsonObject systemMessage = new JsonObject();
        systemMessage.addProperty("role", "system");
        systemMessage.addProperty("content",
            "You are a strict medical education evaluator. " +
            "You MUST respond with ONLY valid JSON. No markdown, no explanation, no extra text. Just the JSON object."
        );

        JsonObject userMessage = new JsonObject();
        userMessage.addProperty("role", "user");
        userMessage.addProperty("content", prompt);

        JsonArray messages = new JsonArray();
        messages.add(systemMessage);
        messages.add(userMessage);

        JsonObject body = new JsonObject();
        body.addProperty("model", model);
        body.addProperty("max_tokens", 1500);
        body.addProperty("temperature", 0.2); // Low temperature = more consistent, strict scoring
        body.add("messages", messages);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .timeout(Duration.ofSeconds(60))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("[EvaluatorService] Groq response status: " + response.statusCode());

            if (response.statusCode() != 200) {
                System.err.println("[EvaluatorService] Groq error body: " + response.body());
                throw new RuntimeException("[EvaluatorService] Groq API error. Status: "
                        + response.statusCode() + ". Body: " + response.body());
            }

            // Extract the content string from Groq's response
            JsonObject responseJson = gson.fromJson(response.body(), JsonObject.class);
            return responseJson.getAsJsonArray("choices")
                               .get(0).getAsJsonObject()
                               .getAsJsonObject("message")
                               .get("content").getAsString()
                               .trim();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("[EvaluatorService] Request interrupted.", e);
        } catch (Exception e) {
            throw new RuntimeException("[EvaluatorService] Failed to contact Groq: " + e.getMessage(), e);
        }
    }

    // ── Private: Parse JSON response into EvaluationReport ───────────────

    private EvaluationReport parseEvaluationResponse(String jsonString, int caseId) {
        // Strip markdown code fences if model wraps in ```json ... ``` despite instructions
        String clean = jsonString.replaceAll("(?s)```json\\s*", "").replaceAll("```", "").trim();

        try {
            JsonObject json = gson.fromJson(clean, JsonObject.class);

            EvaluationReport report = new EvaluationReport();
            report.setCaseId(caseId);

            report.setScoreHistoryTaking(json.get("score_history_taking").getAsDouble());
            report.setScorePhysicalExam(json.get("score_physical_exam").getAsDouble());
            report.setScoreInvestigation(json.get("score_investigation").getAsDouble());
            report.setScoreDiagnosis(json.get("score_diagnosis").getAsDouble());
            report.setScorePrescription(json.get("score_prescription").getAsDouble());

            report.setAiFeedback(json.get("ai_feedback").getAsString());
            report.setModelAnswer(json.get("model_answer").getAsString());
            report.setCorrectActionsJson(json.get("correct_actions").toString());
            report.setMissedActionsJson(json.get("missed_actions").toString());

            // Calculate total and grade from dimension scores
            report.calculateGradeFromTotal();

            System.out.println("[EvaluatorService] Evaluation complete. Total: "
                    + report.getTotalScore() + " | Grade: " + report.getGrade());

            return report;

        } catch (Exception e) {
            throw new RuntimeException(
                "[EvaluatorService] Failed to parse Groq evaluation response.\n" +
                "Raw response was: " + jsonString + "\nError: " + e.getMessage(), e
            );
        }
    }
}

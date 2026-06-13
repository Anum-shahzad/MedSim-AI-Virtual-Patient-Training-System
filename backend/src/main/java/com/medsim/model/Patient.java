package com.medsim.model;

/**
 * Patient — Abstract base class for all patient characters.
 *
 * OOP Concepts demonstrated:
 *   - Abstraction: Patient cannot be instantiated directly.
 *   - Inheritance: AdultPatient, PediatricPatient, ElderlyPatient all extend this.
 *   - Polymorphism: getSystemPrompt() and getAgeGroupLabel() behave differently per subtype.
 *   - Encapsulation: All fields private, accessed via getters.
 *
 * Every patient character in MedSim is one of these 3 subtypes.
 * The 7 specific characters (Saba, Hamza, etc.) are instances of these subtypes
 * with unique names, personalities, and voice IDs assigned at construction.
 */
public abstract class Patient {

    // ── Core identity ─────────────────────────────────────────────────────
    private final String characterName;      // e.g. "Saba Parveen"
    private final String personalityType;    // e.g. "Anxious & Overthinking"
    private final String elevenLabsVoiceId;  // Assigned ElevenLabs voice ID
    private final String glbFileName;        // e.g. "Saba_Parveen.glb"

    // ── Clinical context (set per session) ────────────────────────────────
    private String department;               // e.g. "General Medicine"
    private String chiefComplaint;           // AI-generated per session
    private String emotionalState;           // "Anxious", "Calm", "Sad", etc.

    // ── Constructor ───────────────────────────────────────────────────────
    protected Patient(String characterName, String personalityType,
                      String elevenLabsVoiceId, String glbFileName) {
        this.characterName = characterName;
        this.personalityType = personalityType;
        this.elevenLabsVoiceId = elevenLabsVoiceId;
        this.glbFileName = glbFileName;
    }

    // ── Abstract methods — each subtype must implement these ──────────────

    /**
     * Returns the Grok AI system prompt for this patient.
     * Each subtype adds age-specific behavior on top of the personality prompt.
     *
     * Example: PediatricPatient adds instructions about simple language,
     * fear of needles, and parent-seeking behavior.
     */
    public abstract String getSystemPrompt();

    /**
     * Returns the human-readable age group label.
     * Used in case setup display and evaluation context.
     * Example: "Child (7–12)", "Adult (36–60)", "Senior Citizen (60+)"
     */
    public abstract String getAgeGroupLabel();

    /**
     * Returns the valid department list for this patient type.
     * Example: PediatricPatient returns Pediatrics, General Medicine, ENT, etc.
     * ElderlyPatient returns Cardiology, Ortho, Diabetes, etc.
     */
    public abstract String[] getApplicableDepartments();

    // ── Shared behavior — available to all patient types ─────────────────

    /**
     * Builds the full Grok AI prompt by combining:
     * 1. The base personality prompt (from subtype)
     * 2. The assigned department and chief complaint
     * 3. Language and communication style instructions
     *
     * Called by AIService before every API request.
     */
    public String buildFullPrompt(String studentLanguage) {
        return getSystemPrompt()
             + "\n\nCurrent Department: " + (department != null ? department : "General Medicine")
             + "\nCurrent Emotional State: " + (emotionalState != null ? emotionalState : "Neutral")
             + "\nStudent's language preference: " + studentLanguage
             + "\n\nIMPORTANT RULES:"
             + "\n- You are a PATIENT, not a doctor. Never diagnose yourself."
             + "\n- Stay fully in character at all times."
             + "\n- Do not break character or acknowledge you are an AI."
             + "\n- Respond only as this patient would in a real clinical setting."
             + "\n- Keep responses conversational and realistic in length.";
    }

    // ── Getters ───────────────────────────────────────────────────────────
    public String getCharacterName()     { return characterName; }
    public String getPersonalityType()   { return personalityType; }
    public String getElevenLabsVoiceId() { return elevenLabsVoiceId; }
    public String getGlbFileName()       { return glbFileName; }
    public String getDepartment()        { return department; }
    public String getChiefComplaint()    { return chiefComplaint; }
    public String getEmotionalState()    { return emotionalState; }

    // ── Setters (set per session by SessionManager) ───────────────────────
    public void setDepartment(String department)       { this.department = department; }
    public void setChiefComplaint(String complaint)    { this.chiefComplaint = complaint; }
    public void setEmotionalState(String state)        { this.emotionalState = state; }

    @Override
    public String toString() {
        return "Patient{name='" + characterName + "', type='" + personalityType + "', age='" + getAgeGroupLabel() + "'}";
    }
}

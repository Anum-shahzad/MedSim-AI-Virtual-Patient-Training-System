package com.medsim.model;

/**
 * PediatricPatient — Concrete subclass for child patients (Age 3–17).
 *
 * OOP: Inheritance + Polymorphism.
 * Covers character: Shahreyar (Child, 7–12).
 *
 * Child patients use simple language, describe pain imaginatively,
 * get distracted, fear needles, and look for parental reassurance.
 * This makes them the most challenging patient type to communicate with.
 */
public class PediatricPatient extends Patient {

    private final int ageYears;     // Specific age e.g. 9
    private final boolean hasParentPresent;

    public PediatricPatient(String characterName, String personalityType,
                            String elevenLabsVoiceId, String glbFileName,
                            int ageYears, boolean hasParentPresent) {
        super(characterName, personalityType, elevenLabsVoiceId, glbFileName);
        this.ageYears = ageYears;
        this.hasParentPresent = hasParentPresent;
    }

    @Override
    public String getSystemPrompt() {
        return "You are " + getCharacterName() + ", a " + ageYears + "-year-old child patient visiting a doctor.\n"
             + "Your personality: " + getPersonalityType() + ".\n"
             + "CRITICAL — You MUST speak and behave exactly like a child of " + ageYears + " years:\n"
             + "- Use very simple words. Say 'tummy' not 'abdomen'. Say 'it hurts a lot' not 'severe pain'.\n"
             + "- Describe pain imaginatively: 'it feels like someone is poking me', 'it's all bubbly inside'.\n"
             + "- You get distracted sometimes and mention unrelated things (school, toys, friends).\n"
             + "- You are scared of injections and medical equipment. Express fear if mentioned.\n"
             + "- You don't always know exact details — 'I don't know', 'mama said so' are valid answers.\n"
             + (hasParentPresent
                ? "- A parent is present. You occasionally look at them or say 'right mama?' or 'baba told me'.\n"
                : "- You are alone. You feel slightly more nervous without a parent.\n")
             + "- You respond positively to a friendly, gentle doctor and shut down with a harsh one.\n"
             + "Keep all responses short — children do not give long answers.";
    }

    @Override
    public String getAgeGroupLabel() {
        return "Child (" + ageYears + " years)";
    }

    @Override
    public String[] getApplicableDepartments() {
        return new String[]{
            "Pediatrics", "General Medicine", "ENT",
            "Dentistry", "Eye Specialist", "Emergency"
        };
    }

    public int getAgeYears()          { return ageYears; }
    public boolean isParentPresent()  { return hasParentPresent; }
}

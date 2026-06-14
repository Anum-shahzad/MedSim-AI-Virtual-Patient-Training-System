package com.medsim.model;

/**
 * ElderlyPatient — Concrete subclass for senior citizen patients (Age 60+).
 *
 * OOP: Inheritance + Polymorphism.
 * Covers character: Fatima Begum (Senior Citizen).
 *
 * Elderly patients speak slowly, use cultural references, mention home remedies,
 * may forget parts of their medical history, and need extra time and patience.
 * Trust must be earned gradually — they do not immediately accept modern treatments.
 */
public class ElderlyPatient extends Patient {

    private final int approximateAge;   // e.g. 68
    private final boolean hasChronicConditions;

    public ElderlyPatient(String characterName, String personalityType,
                          String elevenLabsVoiceId, String glbFileName,
                          int approximateAge, boolean hasChronicConditions) {
        super(characterName, personalityType, elevenLabsVoiceId, glbFileName);
        this.approximateAge = approximateAge;
        this.hasChronicConditions = hasChronicConditions;
    }

    @Override
    public String getSystemPrompt() {
        return "You are " + getCharacterName() + ", approximately " + approximateAge + " years old, visiting a doctor.\n"
             + "Your personality: " + getPersonalityType() + ".\n"
             + "You MUST behave like a traditional South Asian elderly patient:\n"
             + "- Speak slowly and respectfully. Use phrases like 'beta', 'doctor sahib', 'Allah ka shukar'.\n"
             + "- You frequently mention home remedies: 'I tried haldi doodh', 'my neighbour said to eat ajwain'.\n"
             + "- You may not remember your full medical history. 'I think I had something... I am not sure.'\n"
             + "- You are slightly resistant to new medicines: 'Are these tablets necessary? They are so expensive.'\n"
             + "- You need slow, clear explanations. Complex medical terms confuse you.\n"
             + "- Trust builds gradually. A patient and respectful doctor earns your cooperation.\n"
             + "- A rude or rushed doctor makes you withdrawn and less cooperative.\n"
             + (hasChronicConditions
                ? "- You have existing chronic conditions (e.g. blood pressure, sugar). Mention them vaguely.\n"
                : "- You consider yourself generally healthy for your age.\n")
             + "Keep responses conversational and realistic in length for an elderly person.";
    }

    @Override
    public String getAgeGroupLabel() {
        return "Senior Citizen (~" + approximateAge + " years)";
    }

    @Override
    public String[] getApplicableDepartments() {
        return new String[]{
            "General Medicine", "Cardiology", "Orthopedics",
            "Eye Specialist", "ENT", "Psychiatry", "Emergency"
        };
    }

    public int getApproximateAge()       { return approximateAge; }
    public boolean hasChronicConditions(){ return hasChronicConditions; }
}

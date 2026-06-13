package com.medsim.model;

/**
 * AdultPatient — Concrete subclass for adult patients (Age 18–60).
 *
 * OOP: Inheritance + Polymorphism.
 * Covers characters: Saba Parveen (Young Adult), Hamza Noor (Adult), Anas (Young Adult), Anum Shahzad (Adult).
 *
 * Adult patients communicate clearly, can describe symptoms accurately,
 * and engage in informed discussion with the doctor.
 */
public class AdultPatient extends Patient {

    private final String ageRange;  // e.g. "18–35" or "36–60"

    public AdultPatient(String characterName, String personalityType,
                        String elevenLabsVoiceId, String glbFileName, String ageRange) {
        super(characterName, personalityType, elevenLabsVoiceId, glbFileName);
        this.ageRange = ageRange;
    }

    @Override
    public String getSystemPrompt() {
        return "You are " + getCharacterName() + ", a patient visiting a doctor.\n"
             + "Your personality: " + getPersonalityType() + ".\n"
             + "Your age range: " + ageRange + " years old.\n"
             + "You communicate at an adult level. You can clearly describe your symptoms "
             + "but you are NOT a medical professional — you describe how you FEEL, not diagnoses.\n"
             + "You respond based on your personality type. For example:\n"
             + "- If you are anxious, you ask worrying questions frequently.\n"
             + "- If you are practical, you want quick clear answers.\n"
             + "- If you are a self-diagnoser, you challenge the doctor's questions.\n"
             + "- If you are cooperative, you answer fully and ask educational questions.\n"
             + "Your responses should feel realistic — not too long, not too short.";
    }

    @Override
    public String getAgeGroupLabel() {
        return "Adult (" + ageRange + ")";
    }

    @Override
    public String[] getApplicableDepartments() {
        return new String[]{
            "General Medicine", "Gynecology", "Cardiology",
            "Dermatology", "Psychiatry", "Orthopedics",
            "Gastroenterology", "Emergency", "Dentistry"
        };
    }

    public String getAgeRange() { return ageRange; }
}

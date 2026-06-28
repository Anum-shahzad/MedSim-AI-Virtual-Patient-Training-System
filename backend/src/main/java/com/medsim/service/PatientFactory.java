package com.medsim.service;

import com.medsim.model.AdultPatient;
import com.medsim.model.ElderlyPatient;
import com.medsim.model.Patient;
import com.medsim.model.PediatricPatient;

/**
 * PatientFactory — Creates the correct Patient object for a given character name.
 *
 * The rest of the system never calls "new AdultPatient(...)" directly.
 * It always asks the factory: PatientFactory.create("Saba Parveen")
 * This decouples object creation from the rest of the codebase.
 *
 */
public class PatientFactory {

    // ── Voice ID constants ──
    private static final String VOICE_SABA      = "TewkH0XURuqpDw0KLjmQ";
    private static final String VOICE_HAMZA     = "EOVAuWqgSZN2Oel78Psj";
    private static final String VOICE_FATIMA    = "qe1lKgLcjsN9kBbYo1J9";
    private static final String VOICE_ANAS      = "qA5SHJ9UjGlW2QwXWR7w";
    private static final String VOICE_ERUM      = "7YaUDeaStRuoYg3FKsmU";
    private static final String VOICE_SHAHREYAR = "2uP9HvwlERzYaZ4h8Gvy";
    private static final String VOICE_ANUM      = "l4Coq6695JDX9xtLqXDE";

    /**
     * Creates and returns the correct Patient subclass instance
     * based on the character name selected in case setup.
     *
     * @param characterName must match exactly one of the 7 defined characters
     * @return the fully configured Patient object ready for a session
     * @throws IllegalArgumentException if the character name is not recognized
     */
    public static Patient create(String characterName) {
        return switch (characterName) {

            case "Saba Parveen" -> new AdultPatient(
                "Saba Parveen",
                "Anxious & Overthinking",
                VOICE_SABA,
                "Saba_Parveen.glb",
                "18–35"
            );

            case "Hamza Noor" -> new AdultPatient(
                "Hamza Noor",
                "Practical & Direct",
                VOICE_HAMZA,
                "Hamza_Noor.glb",
                "36–60"
            );

            case "Anas" -> new AdultPatient(
                "Anas",
                "Overconfident Self-Diagnoser",
                VOICE_ANAS,
                "Anas.glb",
                "18–35"
            );

            case "Anum Shahzad" -> new AdultPatient(
                "Anum Shahzad",
                "Cooperative & Curious",
                VOICE_ANUM,
                "Anum_Shahzad.glb",
                "36–60"
            );

            case "Erum" -> new AdultPatient(
                "Erum",
                "Quiet & Reserved",
                VOICE_ERUM,
                "Erum.glb",
                "18–35"  // Teen/Young Adult treated as adult range for simplicity
            );

            case "Fatima Begum" -> new ElderlyPatient(
                "Fatima Begum",
                "Traditional & Resistive",
                VOICE_FATIMA,
                "fatima_begum.glb",
                68,
                true    
            );

            case "Shahreyar" -> new PediatricPatient(
                "Shahreyar",
                "Curious & Nervous",
                VOICE_SHAHREYAR,
                "Shahreyar.glb",
                9,
                true   // parent present
            );

            default -> throw new IllegalArgumentException(
                "[PatientFactory] Unknown character: '" + characterName + "'. " +
                "Valid names: Saba Parveen, Hamza Noor, Fatima Begum, Anas, Erum, Shahreyar, Anum Shahzad"
            );
        };
    }

    /**
     * Returns the list of all valid character names.
     * Used by the frontend to populate the character selection screen.
     */
    public static String[] getAllCharacterNames() {
        return new String[]{
            "Saba Parveen",
            "Hamza Noor",
            "Fatima Begum",
            "Anas",
            "Erum",
            "Shahreyar",
            "Anum Shahzad"
        };
    }
}

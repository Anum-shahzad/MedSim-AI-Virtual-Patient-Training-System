package com.medsim.service;

import com.medsim.model.Prescription;

import java.util.*;

/**
 * DrugInteractionChecker — Validates a prescription for dangerous drug combinations.
 *
 * How it works:
 *  1. A hardcoded list of known dangerous drug pairs is stored in DANGEROUS_PAIRS.
 *  2. When the student writes a prescription, this checker scans all drug combinations.
 *  3. If a dangerous pair is found, a warning is returned to the frontend.
 *  4. The student sees the warning but makes the final decision — the system never blocks.
 *
 * This is a rule-based checker, not AI-based. It covers the most clinically important
 * interactions that a medical student should know.
 *
 * NOTE: In a real production system, this would connect to a drug interaction database
 * like DrugBank or RxNorm API. For Our Semester Project, the hardcoded list is sufficient.
 */
public class DrugInteractionChecker {

    /**
     * InteractionWarning — Represents a detected dangerous drug pair.
     * Inner static class — tightly coupled to this checker.
     */
    public static class InteractionWarning {
        private final String drug1;
        private final String drug2;
        private final String severity;   // "HIGH" or "MODERATE"
        private final String reason;     // Clinical explanation

        public InteractionWarning(String drug1, String drug2, String severity, String reason) {
            this.drug1    = drug1;
            this.drug2    = drug2;
            this.severity = severity;
            this.reason   = reason;
        }

        public String getDrug1()    { return drug1; }
        public String getDrug2()    { return drug2; }
        public String getSeverity() { return severity; }
        public String getReason()   { return reason; }

        @Override
        public String toString() {
            return "[" + severity + "] " + drug1 + " + " + drug2 + ": " + reason;
        }
    }

    // ── Known dangerous drug pairs ────────────────────────────────────────
    // Format: { "DRUG_A_LOWERCASE|DRUG_B_LOWERCASE", severity, reason }
    // Both orderings are handled — drug A + B = drug B + A
    private static final List<String[]> DANGEROUS_PAIRS = List.of(
        new String[]{ "warfarin|aspirin",         "HIGH",     "Increased bleeding risk — combined anticoagulation effect." },
        new String[]{ "warfarin|ibuprofen",        "HIGH",     "Increased bleeding risk — NSAIDs potentiate warfarin." },
        new String[]{ "methotrexate|aspirin",      "HIGH",     "Aspirin reduces methotrexate clearance — risk of toxicity." },
        new String[]{ "methotrexate|ibuprofen",    "HIGH",     "NSAIDs reduce methotrexate excretion — serious toxicity risk." },
        new String[]{ "ssri|tramadol",             "HIGH",     "Serotonin syndrome risk — potentially life-threatening." },
        new String[]{ "maoi|ssri",                 "HIGH",     "Serotonin syndrome — this combination is contraindicated." },
        new String[]{ "maoi|tramadol",             "HIGH",     "Serotonin syndrome — this combination is contraindicated." },
        new String[]{ "digoxin|amiodarone",        "HIGH",     "Amiodarone increases digoxin levels — risk of digoxin toxicity." },
        new String[]{ "lithium|ibuprofen",         "HIGH",     "NSAIDs increase lithium levels — toxicity risk." },
        new String[]{ "lithium|diclofenac",        "HIGH",     "NSAIDs increase lithium levels — toxicity risk." },
        new String[]{ "sildenafil|nitrate",        "HIGH",     "Severe hypotension — this combination is contraindicated." },
        new String[]{ "sildenafil|isosorbide",     "HIGH",     "Severe hypotension — this combination is contraindicated." },
        new String[]{ "clopidogrel|omeprazole",    "MODERATE", "Omeprazole reduces clopidogrel activation — reduced antiplatelet effect." },
        new String[]{ "simvastatin|amiodarone",    "MODERATE", "Increased risk of myopathy and rhabdomyolysis." },
        new String[]{ "ciprofloxacin|antacid",     "MODERATE", "Antacids reduce ciprofloxacin absorption — take 2 hours apart." },
        new String[]{ "tetracycline|antacid",      "MODERATE", "Antacids chelate tetracycline — reduced absorption." },
        new String[]{ "metformin|alcohol",         "MODERATE", "Increased risk of lactic acidosis." },
        new String[]{ "ace inhibitor|potassium",   "MODERATE", "Risk of dangerous hyperkalaemia." },
        new String[]{ "spironolactone|potassium",  "MODERATE", "Risk of dangerous hyperkalaemia." },
        new String[]{ "fluconazole|warfarin",      "HIGH",     "Fluconazole inhibits warfarin metabolism — major bleeding risk." }
    );

    /**
     * Checks a prescription for dangerous drug interactions.
     *
     * @param prescription the student's completed prescription
     * @return list of InteractionWarning — empty list means prescription is safe
     */
    public List<InteractionWarning> check(Prescription prescription) {
        List<InteractionWarning> warnings = new ArrayList<>();

        if (prescription == null || prescription.isEmpty()) {
            return warnings;
        }

        // Get all drug names, normalized to lowercase for comparison
        List<String> drugNames = new ArrayList<>();
        for (Prescription.DrugEntry drug : prescription.getDrugs()) {
            drugNames.add(drug.getDrugName().toLowerCase().trim());
        }

        // Check every pair of drugs against the dangerous pairs list
        for (int i = 0; i < drugNames.size(); i++) {
            for (int j = i + 1; j < drugNames.size(); j++) {
                String drugA = drugNames.get(i);
                String drugB = drugNames.get(j);

                InteractionWarning warning = findInteraction(drugA, drugB);
                if (warning != null) {
                    warnings.add(warning);
                }
            }
        }

        if (!warnings.isEmpty()) {
            System.out.println("[DrugInteractionChecker] " + warnings.size() + " interaction(s) detected.");
        }
        return warnings;
    }

    // ── Private: Match drug pair against known dangerous combinations ──────

    private InteractionWarning findInteraction(String drugA, String drugB) {
        for (String[] pair : DANGEROUS_PAIRS) {
            String[] knownDrugs = pair[0].split("\\|");
            String known1 = knownDrugs[0];
            String known2 = knownDrugs[1];

            // Check both orderings and partial name matches
            if ((drugA.contains(known1) && drugB.contains(known2)) ||
                (drugA.contains(known2) && drugB.contains(known1))) {
                return new InteractionWarning(drugA, drugB, pair[1], pair[2]);
            }
        }
        return null; // No interaction found
    }
}

package com.medsim.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Diagnosis — Holds the student's diagnostic decisions for a session.
 *
 * OOP: Encapsulation.
 * Separates diagnosis data from session state cleanly.
 */
public class Diagnosis {

    private String primaryDiagnosis;
    private final List<String> differentialDiagnoses = new ArrayList<>();

    public Diagnosis(String primaryDiagnosis) {
        this.primaryDiagnosis = primaryDiagnosis;
    }

    public void addDifferential(String differential) {
        differentialDiagnoses.add(differential);
    }

    public String getPrimaryDiagnosis()            { return primaryDiagnosis; }
    public void setPrimaryDiagnosis(String d)      { this.primaryDiagnosis = d; }
    public List<String> getDifferentialDiagnoses() { return differentialDiagnoses; }

    @Override
    public String toString() {
        return "Primary: " + primaryDiagnosis + " | Differentials: " + differentialDiagnoses;
    }
}

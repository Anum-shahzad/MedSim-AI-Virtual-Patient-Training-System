package com.medsim.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Prescription — Holds the student's complete prescription for a session.
 *
 * OOP: Encapsulation.
 * A prescription contains one or more DrugEntry items.
 * The DrugInteractionChecker service reads this object to validate safety.
 */
public class Prescription {

    private final List<DrugEntry> drugs = new ArrayList<>();
    private String counsellingNotes;

    public void addDrug(DrugEntry drug) { drugs.add(drug); }
    public List<DrugEntry> getDrugs()   { return drugs; }

    public String getCounsellingNotes()                { return counsellingNotes; }
    public void setCounsellingNotes(String notes)      { this.counsellingNotes = notes; }

    public boolean isEmpty() { return drugs.isEmpty(); }

    /**
     * DrugEntry — A single drug in the prescription.
     * Inner static class — tightly coupled to Prescription, no reason to separate.
     */
    public static class DrugEntry {
        private String drugName;    // e.g. "Amoxicillin"
        private String dose;        // e.g. "500mg"
        private String route;       // e.g. "Oral"
        private String frequency;   // e.g. "Three times daily"
        private String duration;    // e.g. "7 days"

        public DrugEntry(String drugName, String dose, String route,
                         String frequency, String duration) {
            this.drugName  = drugName;
            this.dose      = dose;
            this.route     = route;
            this.frequency = frequency;
            this.duration  = duration;
        }

        public String getDrugName()   { return drugName; }
        public String getDose()       { return dose; }
        public String getRoute()      { return route; }
        public String getFrequency()  { return frequency; }
        public String getDuration()   { return duration; }

        @Override
        public String toString() {
            return drugName + " " + dose + " — " + route + " — " + frequency + " for " + duration;
        }
    }
}

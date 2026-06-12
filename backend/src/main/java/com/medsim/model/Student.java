package com.medsim.model;

import java.time.LocalDateTime;

/**
 * Student — Model class representing a registered medical student.
 *
 * OOP: Encapsulation (private fields + getters/setters)
 */
public class Student {

    private int id;                  // Database PK
    private String studentId;        // e.g. "0874" — user-facing ID
    private String fullName;
    private String universityName;
    private int yearOfStudy;         // 1–6
    private String languagePref;      
    private int failedAttempts;
    private LocalDateTime lockedUntil;
    private LocalDateTime createdAt;

    public Student() {}

    public Student(String studentId, String fullName, String universityName,
                   int yearOfStudy, String languagePref) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.universityName = universityName;
        this.yearOfStudy = yearOfStudy;
        this.languagePref = languagePref;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getUniversityName() { return universityName; }
    public void setUniversityName(String universityName) { this.universityName = universityName; }

    public int getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(int yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getLanguagePref() { return languagePref; }
    public void setLanguagePref(String languagePref) { this.languagePref = languagePref; }

    public int getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(int failedAttempts) { this.failedAttempts = failedAttempts; }

    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "Student{id=" + id + ", studentId='" + studentId + "', name='" + fullName + "'}";
    }
}

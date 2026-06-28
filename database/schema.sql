-- ============================================================
--  MedSim — MySQL Database Schema
--  Version 1.0  |  OOP Semester Final Project
--  Run this file once to set up the entire database.
-- ============================================================

CREATE DATABASE IF NOT EXISTS medsim
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;


USE medsim;

-- ─────────────────────────────────────────────────────────────
--  TABLE: students
--  Stores registered medical student accounts.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    student_id       VARCHAR(50)  NOT NULL UNIQUE,   -- e.g. "0874"
    full_name        VARCHAR(150) NOT NULL,
    university_name  VARCHAR(200) NOT NULL,
    year_of_study    TINYINT      NOT NULL,           -- 1–6
    language_pref    ENUM('English', 'Urdu', 'Sindhi') NOT NULL DEFAULT 'English',
    password_hash    VARCHAR(255) NOT NULL,           -- BCrypt hash, never plaintext
    failed_attempts  TINYINT      NOT NULL DEFAULT 0, -- brute-force counter
    locked_until     DATETIME     NULL,               -- NULL = not locked
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
--  TABLE: session_tokens
--  Tracks active login sessions. Invalidated on logout.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS session_tokens (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    student_id   INT          NOT NULL,
    token        VARCHAR(255) NOT NULL UNIQUE,   -- UUID token
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at   DATETIME     NOT NULL,          -- e.g. 24 hours after login
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
--  TABLE: cases
--  Represents a single consultation session.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cases (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    student_id          INT          NOT NULL,
    patient_character   VARCHAR(100) NOT NULL,   -- e.g. "Saba Parveen"
    patient_age_group   ENUM('Child', 'Teen', 'YoungAdult', 'Adult', 'Senior') NOT NULL,
    department          VARCHAR(100) NOT NULL,   -- e.g. "General Medicine"
    started_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at        DATETIME     NULL,        -- NULL = still in progress
    status              ENUM('InProgress', 'Submitted', 'Evaluated') NOT NULL DEFAULT 'InProgress',

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
--  TABLE: case_transcripts
--  Stores the full conversation log for a case.
--  Each row = one message (student or patient).
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_transcripts (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    case_id     INT          NOT NULL,
    sender      ENUM('Student', 'Patient') NOT NULL,
    message     TEXT         NOT NULL,
    sent_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
--  TABLE: case_submissions
--  Stores the student's final clinical decisions for a case.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_submissions (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    case_id                 INT  NOT NULL UNIQUE,   -- one submission per case
    primary_diagnosis       TEXT NOT NULL,
    differential_diagnosis  TEXT NULL,
    examinations_performed  TEXT NULL,              -- JSON array of exam steps
    tests_ordered           TEXT NULL,              -- JSON array of test names
    prescription            TEXT NULL,              -- JSON: drug, dose, route, freq, duration
    counselling_notes       TEXT NULL,
    submitted_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
--  TABLE: evaluation_reports
--  Stores OpenAI evaluation scores for each submitted case.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS evaluation_reports (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    case_id                     INT NOT NULL UNIQUE,

    -- Dimension scores (out of specified max points per doc)
    score_history_taking        DECIMAL(5,2) NOT NULL DEFAULT 0,  -- max 25
    score_physical_exam         DECIMAL(5,2) NOT NULL DEFAULT 0,  -- max 20
    score_investigation         DECIMAL(5,2) NOT NULL DEFAULT 0,  -- max 20
    score_diagnosis             DECIMAL(5,2) NOT NULL DEFAULT 0,  -- max 20
    score_prescription          DECIMAL(5,2) NOT NULL DEFAULT 0,  -- max 15

    total_score                 DECIMAL(5,2) NOT NULL DEFAULT 0,  -- max 100
    grade                       ENUM('A', 'B', 'C', 'D', 'F') NOT NULL,

    -- Full AI feedback and model answer stored as text
    ai_feedback                 TEXT NULL,
    model_answer                TEXT NULL,

    -- Highlights: correct/missed actions (stored as JSON arrays)
    correct_actions             TEXT NULL,
    missed_actions              TEXT NULL,

    evaluated_at                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
--  TABLE: student_badges
--  Milestone badges earned by students.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_badges (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    student_id  INT          NOT NULL,
    badge_name  VARCHAR(100) NOT NULL,  -- e.g. "First Case", "High Scorer"
    earned_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
--  INDEXES — for fast lookups on commonly queried columns
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_cases_student     ON cases(student_id);
CREATE INDEX idx_transcript_case   ON case_transcripts(case_id);
CREATE INDEX idx_token_student     ON session_tokens(student_id);
CREATE INDEX idx_badges_student    ON student_badges(student_id);

-- ─────────────────────────────────────────────────────────────
--  DONE — schema creation complete.
--  Run: mysql -u root -p < database/schema.sql
-- ─────────────────────────────────────────────────────────────

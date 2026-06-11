# MedSim — AI Virtual Patient Training System

> OOP Semester Final Project | Java 17 + React + Electron + MySQL

## What is MedSim?

MedSim is an AI-powered medical simulation desktop Java application for medical students. It enables students to conduct realistic virtual patient consultations across 10 medical departments before entering real clinical environments.

Students interact with AI-driven virtual patients, perform physical examinations, order diagnostic tests, and submit their clinical decisions. The Groq AI then evaluates their performance across five clinical dimensions and generates a detailed scored report.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Maven, Javalin REST API |
| Database | MySQL 8.0 with JDBC DAO layer |
| Frontend | React 18 + Vite |
| Desktop Wrapper | Electron 29 |
| AI Engine | Groq API (patient dialogue + clinical evaluation) |
| Voice Output | Web Speech API (browser-native TTS, built into Electron) |
| Voice Input | Web Speech API (browser-native STT) |
| PDF Export | iText7 |
| Password Security | jBCrypt |

---

## Prerequisites

- Java 17 JDK — https://adoptium.net
- Maven 3.8+ — https://maven.apache.org
- MySQL 8.0+ — https://dev.mysql.com/downloads
- Node.js 18+ — https://nodejs.org

---

## Setup Instructions

### 1. Database Setup

Run the schema file once to create all tables:

```bash
mysql -u root -p < database/schema.sql
```
```


### 2. Run Backend

```bash
mvn clean compile
mvn exec:java -Dexec.mainClass="com.medsim.Main"
```

Backend runs at: `http://localhost:8080`

### 3. Run Frontend (Browser)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 4. Run as Desktop App (Electron)

```bash
cd frontend
npm run electron:dev
```

---

## Project Structure

```
MedSim/
├── config.properties.example       ← API keys + DB config template 
├── database/schema.sql             ← Full MySQL schema —  
├── backend/
│   ├── pom.xml                     ← Maven dependencies
│   └── src/main/java/com/medsim/
│       ├── Main.java               ← Entry point — starts Javalin server
│       ├── api/                    ← REST API handlers (Auth, Session, History)
│       ├── model/                  ← OOP Patient hierarchy (abstract + subtypes)
│       ├── database/               ← DAO layer — all MySQL queries
│       ├── service/                ← AI, Evaluator, Session, Drug, PDF services
│       └── util/                   ← AppConfig, EncryptionUtil
└── frontend/
    ├── electron/main.js            ← Electron desktop wrapper
    ├── src/pages/                  ← All React page components
    ├── src/components/             ← Shared UI components (PatientCharacter, VoiceRecorder)
    ├── src/context/                ← AuthContext, SessionContext
    ├── src/api/client.js           ← Axios API wrappers
    └── src/services/               ← voiceService (Web Speech API TTS)
```

---

## OOP Concepts Used (Java Backend)

| Concept | Where |
|---|---|
| Abstract Class | `Patient.java` — abstract base for all patient types |
| Inheritance | `AdultPatient`, `ElderlyPatient`, `PediatricPatient` extend `Patient` |
| Polymorphism | `PatientFactory.create()` returns correct subtype at runtime |
| Encapsulation | All model fields private with getters/setters |
| Factory Pattern | `PatientFactory.java` creates patients based on character name |
| DAO Pattern | `StudentDAO`, `SessionDAO`, `SessionTokenDAO` isolate all DB logic |
| Composition | `SessionManager` composes `AIService`, `EvaluatorService`, `SessionDAO` |

---

## Supported Departments

| | |
|---|---|
| General Medicine | Cardiology |
| Gynecology | Orthopedics |
| Dentistry | Emergency |
| Eye Specialist | Psychiatry |
| ENT | Pediatrics |

---

## REST API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register new student |
| POST | `/api/auth/login` | No | Login, returns Bearer token |
| POST | `/api/auth/logout` | Yes | Invalidate token |
| GET | `/api/auth/me` | Yes | Get current student profile |
| POST | `/api/session/start` | Yes | Start consultation |
| POST | `/api/session/message` | Yes | Send message to AI patient |
| POST | `/api/session/submit` | Yes | Submit case for evaluation |
| GET | `/api/history` | Yes | All past sessions |
| GET | `/api/report/:caseId` | Yes | Evaluation report |
| GET | `/api/leaderboard` | Yes | Global rankings |


## Security Notes

- Passwords hashed with BCrypt — never stored in plaintext
- Account locked for 60 seconds after 3 failed login attempts
- Session tokens are UUIDs that expire after 24 hours
- All protected endpoints require `Authorization: Bearer <token>`
- `config.properties` is gitignored — API keys are never committed
- Student messages are sanitized (HTML stripped, length capped) before being sent to Groq

---

 
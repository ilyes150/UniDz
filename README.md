# UniDZ Portal — Technical Documentation

> **University Student Academic Portal**  
> Stack: Spring Boot 3.2.3 · PostgreSQL 15 · Nginx · Docker Compose  
> Java 17 · Maven · Spring Data JPA · Lombok

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Backend — Spring Boot](#6-backend--spring-boot)
7. [Frontend](#7-frontend)
8. [Authentication](#8-authentication)
9. [API Reference](#9-api-reference)
10. [Docker & Deployment](#10-docker--deployment)
11. [Quick Start](#11-quick-start)

---

## 1. Project Overview

**UniDZ Portal** is a web-based academic portal that allows university students to securely log in and view their academic records — including module grades, unit averages, credits earned, semester averages, and class rankings — across up to three tracked semesters.

The system is fully containerised and designed to run on any machine with Docker installed, with no manual environment configuration required.

---

## 2. Architecture

The application follows a classic **three-tier architecture** deployed as three Docker containers managed by Docker Compose:

```
Browser
  │
  ▼
┌─────────────────────────────┐
│  Nginx (port 80)            │  ← Serves static HTML/CSS/JS
│  frontend container         │  ← Proxies /api/* → backend
└──────────────┬──────────────┘
               │ HTTP (internal Docker network)
               ▼
┌─────────────────────────────┐
│  Spring Boot (port 8080)    │  ← REST API
│  backend-api container      │  ← Business logic + auth
└──────────────┬──────────────┘
               │ JDBC
               ▼
┌─────────────────────────────┐
│  PostgreSQL 15 (port 5432)  │  ← Persistent data store
│  postgres-db container      │  ← Auto-initialised via SQL scripts
└─────────────────────────────┘
```

**Container startup order (enforced by healthchecks):**

```
postgres-db  →  backend-api  →  frontend
```

---

## 3. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Backend Framework | Spring Boot | 3.2.3 |
| Language | Java | 17 |
| Build Tool | Maven | (via wrapper) |
| ORM | Spring Data JPA / Hibernate | — |
| Database | PostgreSQL | 15-alpine |
| Web Server / Proxy | Nginx | alpine |
| Containerisation | Docker / Docker Compose | v3.8 |
| Boilerplate Reduction | Lombok | latest |
| Health Monitoring | Spring Boot Actuator | — |

---

## 4. Project Structure

```
unidz-portal/
├── docker-compose.yml          ← 3-service orchestration
├── Dockerfile                  ← Backend image (JDK 17 + wget)
├── nginx.conf                  ← Static serving + /api proxy
├── pom.xml                     ← Maven dependencies
│
├── src/main/
│   ├── java/com/unidz/portal/
│   │   ├── PortalApplication.java          ← Entry point
│   │   ├── controller/
│   │   │   └── PortalController.java       ← REST endpoints
│   │   ├── service/
│   │   │   └── PortalService.java          ← Business logic
│   │   ├── model/
│   │   │   ├── Student.java
│   │   │   ├── Login.java
│   │   │   ├── Result.java
│   │   │   ├── Semester1.java
│   │   │   ├── Semester2.java
│   │   │   └── Semester3.java
│   │   └── repository/
│   │       ├── LoginRepository.java
│   │       ├── StudentRepository.java
│   │       ├── ResultRepository.java
│   │       ├── Semester1Repository.java
│   │       ├── Semester2Repository.java
│   │       └── Semester3Repository.java
│   └── resources/
│       └── application.properties
│
├── frontend/
│   ├── login.html
│   ├── home.html
│   ├── Style.css
│   └── JS/
│       ├── login.js
│       └── home.js
│
└── init-scripts/               ← Auto-run by Postgres on first start
    ├── 01_tables.sql
    ├── 02_student.sql
    ├── 03_login.sql
    ├── 04_semester1.sql
    ├── 05_semester2.sql
    ├── 06_semester3.sql
    └── 07_result.sql
```

---

## 5. Database Schema

### `student`
Stores core student profile information.

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK) | Unique student ID |
| `fname` | VARCHAR(100) | First name |
| `lname` | VARCHAR(100) | Last name |
| `student_code` | VARCHAR(50) | National student code (used as username) |
| `field` | VARCHAR(255) | Field of study |
| `major` | VARCHAR(255) | Major / branch |
| `specialty` | VARCHAR(255) | Specialty |
| `cycle` | VARCHAR(100) | Academic cycle (e.g., Engineering) |
| `level` | INT | Year of study |
| `group_num` | INT | Group |

### `login`
Maps each student to their hashed credentials.

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK, FK → student) | Student ID |
| `username` | VARCHAR(20) | Login username (= student_code) |
| `password` | VARCHAR(256) | SHA-256 hex digest |

### `semester1`

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK, FK → student) | Student ID |
| `ASD1` | DECIMAL(5,2) | Algorithms & Data Structures 1 |
| `IOS1` | DECIMAL(5,2) | Introduction to Operating Systems 1 |
| `SM` | DECIMAL(5,2) | Machine Structure |
| `Avg_UEF1` | DECIMAL(5,2) | Average — UEF1 (ASD1 + IOS1 + SM) |
| `Credit_UEF1` | INT | Credits — UEF1 |
| `Algebra1` | DECIMAL(5,2) | Algebra 1 |
| `Calculus1` | DECIMAL(5,2) | Calculus 1 |
| `Avg_UEF2` | DECIMAL(5,2) | Average — UEF2 (Algebra1 + Calculus1) |
| `Credit_UEF2` | INT | Credits — UEF2 |
| `Electronic` | DECIMAL(5,2) | Basic Electronics |
| `Avg_UED` | DECIMAL(5,2) | Average — UED (Electronic) |
| `Credit_UED` | INT | Credits — UED |
| `TE` | DECIMAL(5,2) | Expression Techniques |
| `Avg_UET` | DECIMAL(5,2) | Average — UET (TE) |
| `Credit_UET` | INT | Credits — UET |
| `Credit_Sem` | INT | Total semester credits |
| `Avg_Sem` | DECIMAL(5,2) | Semester average |
| `rank` | INT | Rank in class for Semester 1 |

### `semester2`

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK, FK → student) | Student ID |
| `ASD2` | DECIMAL(5,2) | Algorithms & Data Structures 2 |
| `ADO` | DECIMAL(5,2) | Computer Architecture & Organization |
| `Avg_UEF1` | DECIMAL(5,2) | Average — UEF1 (ASD2 + ADO) |
| `Credit_UEF1` | INT | Credits — UEF1 |
| `Algebra2` | DECIMAL(5,2) | Algebra 2 |
| `Calculus2` | DECIMAL(5,2) | Calculus 2 |
| `LM` | DECIMAL(5,2) | Mathematical Logic |
| `Avg_UEF2` | DECIMAL(5,2) | Average — UEF2 (Algebra2 + Calculus2 + LM) |
| `Credit_UEF2` | INT | Credits — UEF2 |
| `PST1` | DECIMAL(5,2) | Probability & Statistics 1 |
| `Avg_UEM` | DECIMAL(5,2) | Average — UEM (PST1) |
| `Credit_UEM` | INT | Credits — UEM |
| `OET` | DECIMAL(5,2) | Oral Expression Techniques |
| `Avg_UET` | DECIMAL(5,2) | Average — UET (OET) |
| `Credit_UET` | INT | Credits — UET |
| `Credit_Sem` | INT | Total semester credits |
| `Avg_Sem` | DECIMAL(5,2) | Semester average |
| `rank` | INT | Rank in class for Semester 2 |

### `semester3`

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK, FK → student) | Student ID |
| `ASD3` | DECIMAL(5,2) | Algorithms & Data Structures 3 |
| `ISI` | DECIMAL(5,2) | Introduction to Information Systems |
| `OOP1` | DECIMAL(5,2) | Object-Oriented Programming 1 |
| `Avg_UEF1` | DECIMAL(5,2) | Average — UEF1 (ASD3 + ISI + OOP1) |
| `Credit_UEF1` | INT | Credits — UEF1 |
| `Algebre3` | DECIMAL(5,2) | Algebra 3 |
| `Calculus3` | DECIMAL(5,2) | Calculus 3 |
| `Avg_UEF2` | DECIMAL(5,2) | Average — UEF2 (Algebre3 + Calculus3) |
| `Credit_UEF2` | INT | Credits — UEF2 |
| `PST2` | DECIMAL(5,2) | Probability & Statistics 2 |
| `Avg_UEM` | DECIMAL(5,2) | Average — UEM (PST2) |
| `Credit_UEM` | INT | Credits — UEM |
| `Entreprenariat` | DECIMAL(5,2) | Entrepreneurship |
| `Avg_UET` | DECIMAL(5,2) | Average — UET (Entreprenariat) |
| `Credit_UET` | INT | Credits — UET |
| `Credit_Sem` | INT | Total semester credits |
| `Avg_Sem` | DECIMAL(5,2) | Semester average |
| `rank` | INT | Rank in class for Semester 3 |

### `semester4`
Table exists in the schema but contains no data. The Semester 04 tab in the UI is locked with the label "Term Data Unreleased".

### `result`
Aggregated cross-semester performance record per student.

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK, FK → student) | Student ID |
| `avg_s1` | DECIMAL(5,2) | Semester 1 average |
| `avg_s2` | DECIMAL(5,2) | Semester 2 average |
| `avg_s3` | DECIMAL(5,2) | Semester 3 average |
| `avg_s4` | DECIMAL(5,2) | Semester 4 average (NULL — no data yet) |
| `avg` | DECIMAL(5,2) | Overall cumulative average (S1+S2+S3 / 3) |
| `rank` | INT | Overall class rank |

---

## 6. Backend — Spring Boot

### Entry Point

`PortalApplication.java` — standard `@SpringBootApplication` bootstrapper.

### Controller — `PortalController`

Base path: `/api/portal`  
Annotation: `@RestController`, `@CrossOrigin(origins = "*")`

#### Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/portal/login` | Authenticate student, return profile + metrics |
| `GET` | `/api/portal/semester/{semNum}?studentId=X` | Return semester grade record |

### Service — `PortalService`

Provides `authenticateAndFetchProfile(username, rawPassword)` and `getPerformanceMetrics(studentId)` as reusable service-layer methods. Note: the controller currently implements auth logic inline and does not delegate to this service.

### Models (JPA Entities)

All models use `@Entity`, `@Table`, Lombok `@Getter`/`@Setter`.

| Model | Table | Notes |
|---|---|---|
| `Student` | `student` | Core profile fields |
| `Login` | `login` | Credentials — username + SHA-256 password hash |
| `Result` | `result` | Cross-semester averages and overall rank |
| `Semester1` | `semester1` | All S1 grades, unit averages, credits, rank |
| `Semester2` | `semester2` | All S2 grades, unit averages, credits, rank |
| `Semester3` | `semester3` | All S3 grades, unit averages, credits, rank |

### Repositories

All extend `JpaRepository<Model, Integer>`. `LoginRepository` additionally declares `findByUsername(String username)`.

---

## 7. Frontend

The frontend is a static two-page web app served by Nginx.

### Pages

| File | Description |
|---|---|
| `login.html` | Student login form |
| `home.html` | Dashboard — student profile, semester tabs, grade tables |

### JavaScript

**`JS/login.js`**
- Redirects to `home.html` immediately if a session already exists in `localStorage`.
- Uses `history.replaceState` to kill the forward-button after logout.
- Sends `POST /api/portal/login`, stores `unidz_student` and `unidz_metrics` in `localStorage`, then redirects to `home.html`.

**`JS/home.js`**
- Redirects to `login.html` if no session found in `localStorage`.
- Uses `history.pushState` + `popstate` event listener so pressing the browser back button automatically clears the session and redirects to login — the student cannot navigate back to the dashboard without re-authenticating.
- Fetches semester data on tab switch via `GET /api/portal/semester/{n}?studentId=X`.
- Caches semester responses in memory to avoid redundant API calls.
- Renders grade tables dynamically, colouring grades green (≥ 10) or red (< 10).

### Subject Name Registry

`home.js` maps JPA camelCase field names to human-readable subject names:

| Field | Subject Name |
|---|---|
| `asd1` | Algorithms & Data Structures 1 |
| `ios1` | Introduction to Operating Systems 1 |
| `sm` | Machine Structure |
| `algebra1` | Algebra 1 |
| `calculus1` | Calculus 1 |
| `electronic` | Basic Electronics |
| `te` | Expression Techniques |
| `asd2` | Algorithms & Data Structures 2 |
| `ado` | Computer Architecture & Organization |
| `algebra2` | Algebra 2 |
| `calculus2` | Calculus 2 |
| `lm` | Mathematical Logic |
| `pst1` | Probability & Statistics 1 |
| `oet` | Oral Expression Techniques |
| `asd3` | Algorithms & Data Structures 3 |
| `isi` | Introduction to Information Systems |
| `oop1` | Object-Oriented Programming 1 |
| `algebre3` | Algebra 3 |
| `calculus3` | Calculus 3 |
| `pst2` | Probability & Statistics 2 |
| `entreprenariat` | Entrepreneurship |

### API Base URL

`API_BASE` is set to `""` (empty string) in both JS files. All requests are relative (`/api/portal/...`) and Nginx proxies them to the backend container. No hardcoded hostnames or ports.

---

## 8. Authentication

Authentication is hash-based with no external library.

### Password Derivation

```
stored_hash = SHA-256( "science" + student_code.substring(4) )
```

`substring(4)` skips the first 4 characters of the student code (0-indexed in Java, matching PostgreSQL's 1-indexed `substring(str FROM 5)`).

**Example:**

| Field | Value |
|---|---|
| Student code | `232335488809` |
| Characters skipped | `2323` |
| Salt string | `science35488809` |
| Password to type | `science35488809` |
| Stored value | `SHA-256("science35488809")` as lowercase hex |

### Initialisation (SQL)

```sql
encode(sha256(concat('science', substring(student_code from 5))::bytea), 'hex')
```

### Login Flow

1. Student submits `student_code` as username and the derived string as password.
2. Backend validates username length (≥ 5 characters).
3. Backend looks up the `login` record by username.
4. Backend computes `SHA-256(passwordInput)` and compares against the stored hex hash (case-insensitive).
5. On success, loads `Student` and `Result` records and returns them in the response body.
6. Frontend stores both objects in `localStorage` and redirects to `home.html`.

> **Known bug (unfixed):** `PortalController` currently recomputes the hash from the username (`"science" + username.substring(4)`) instead of hashing the submitted `passwordInput`. This means any password is accepted as long as the username exists.  
> **Fix:** replace the hash derivation line in the controller with `computeSHA256(passwordInput)`.

---

## 9. API Reference

### `POST /api/portal/login`

**Request body:**
```json
{
  "username": "232335488809",
  "password": "science35488809"
}
```

**Success response (200):**
```json
{
  "student": {
    "id": 36,
    "fname": "BELLIL",
    "lname": "Ilyes Abdelfetah",
    "studentCode": "232335488809",
    "field": "Mathematics and Computer Science",
    "major": "Computer Science",
    "specialty": "Common Core of Computer Science",
    "cycle": "Engineering",
    "level": 2,
    "groupNum": 4
  },
  "metrics": {
    "id": 36,
    "avgS1": 15.10,
    "avgS2": 16.54,
    "avgS3": 15.79,
    "avgS4": null,
    "avg": 15.81,
    "rank": 2
  }
}
```

**Error responses:**

| Status | Condition |
|---|---|
| 400 | Missing or empty username / password |
| 401 | Username shorter than 5 characters, username not found, or wrong password |
| 404 | Student profile record not found (data integrity error) |

---

### `GET /api/portal/semester/{semNum}?studentId={id}`

**Path parameter:** `semNum` — integer, 1, 2, or 3 (4 is locked)  
**Query parameter:** `studentId` — integer

**Success response (200):** Full semester record as a JSON object containing all module grades, unit averages, credits, semester average, and rank.

**Example (Semester 1, student 36):**
```json
{
  "id": 36,
  "asd1": 18.10,
  "ios1": 17.45,
  "sm": 14.60,
  "avgUef1": 16.77,
  "creditUef1": 16,
  "algebra1": 14.70,
  "calculus1": 12.00,
  "avgUef2": 13.35,
  "creditUef2": 9,
  "electronic": 5.00,
  "avgUed": 5.00,
  "creditUed": 0,
  "te": 15.75,
  "avgUet": 15.75,
  "creditUet": 2,
  "creditSem": 30,
  "avgSem": 15.10,
  "rank": 11
}
```

**Error responses:**

| Status | Condition |
|---|---|
| 400 | Missing `studentId` or `semNum` out of range (not 1–3) |
| 404 | No record found for that student / semester combination |

---

## 10. Docker & Deployment

### Services Overview

#### `postgres-db`
- Image: `postgres:15-alpine`
- Mounts `./init-scripts` — SQL files execute automatically in filename order on first run.
- Healthcheck: `pg_isready -U engine_admin -d unidz_portal` every 5 s, up to 10 retries.

#### `backend-api`
- Built from `./Dockerfile` (Spring Boot fat JAR on JDK 17 Alpine + `wget`).
- Receives DB connection details via environment variables at runtime.
- Healthcheck: `wget -qO- http://localhost:8080/actuator/health` every 10 s.
- `depends_on: postgres-db: condition: service_healthy`.

#### `frontend`
- Image: `nginx:alpine`
- Serves `./frontend` as static files on port 80.
- Mounts `./nginx.conf` for `/api/*` proxy config.
- `depends_on: backend-api: condition: service_healthy`.

### `nginx.conf`

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index login.html;

  location /api/ {
    proxy_pass http://backend-api:8080;
  }
}
```

### Environment Variables (`backend-api`)

| Variable | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://postgres-db:5432/unidz_portal` |
| `SPRING_DATASOURCE_USERNAME` | `engine_admin` |
| `SPRING_DATASOURCE_PASSWORD` | `VaultSecurePassword2026` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |

---

## 11. Quick Start

### Prerequisites
Docker Desktop (or Docker Engine + Docker Compose plugin).

### Steps

```bash
# 1. Remove any old containers and volumes (ensures init scripts re-run)
docker compose down -v

# 2. Build images and start all three services
docker compose up --build
```

Startup is fully automatic — Postgres initialises first, then the backend, then Nginx.

### Access the Portal

Open **`http://localhost`** in any browser.

### Login Credentials

The password for every student is derived from their student code:

```
password = "science" + student_code.substring(4)
```

| Student | Student Code | Password |
|---|---|---|
| BELLIL Ilyes Abdelfetah | `232335488809` | `science35488809` |
| GAMECHE Ramzi | `222435500707` | `science35500707` |
| DJAMEL Abderezzak | `242439524312` | `science39524312` |
| HASSED Mohamed Nedjmeddine | `242435345213` | `science35345213` |
| KRECHE Abderraouf | `242435358616` | `science35358616` |

> Substitute any `student_code` from the `student` table using the same rule.

---

*Documentation for UniDZ Portal v1.0.0*
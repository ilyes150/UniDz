const API_BASE = "https://unidz.onrender.com";

// Auth guard
const currentStudent  = JSON.parse(localStorage.getItem("unidz_student"));
const academicMetrics = JSON.parse(localStorage.getItem("unidz_metrics"));

if (!currentStudent) {
    window.location.replace("login.html");
}

// Back-button guard
history.pushState(null, "", location.href);

window.addEventListener("popstate", function () {
    localStorage.clear();
    window.location.replace("login.html");
});

// Subject name registry
const subjectRegistry = {
    asd1:           "Algorithms & Data Structures 1",
    ios1:           "Introduction to Operating Systems 1",
    sm:             "Machine Structure",
    algebra1:       "Algebra 1",
    calculus1:      "Calculus 1",
    electronic:     "Basic Electronics",
    te:             "Expression Techniques",
    asd2:           "Algorithms & Data Structures 2",
    ado:            "Computer Architecture & Organization",
    algebra2:       "Algebra 2",
    calculus2:      "Calculus 2",
    lm:             "Mathematical Logic",
    pst1:           "Probability & Statistics 1",
    oet:            "Oral Expression Techniques",
    asd3:           "Algorithms & Data Structures 3",
    isi:            "Introduction to Information Systems",
    oop1:           "Object-Oriented Programming 1",
    algebre3:       "Algebra 3",
    calculus3:      "Calculus 3",
    pst2:           "Probability & Statistics 2",
    entreprenariat: "Entrepreneurship"
};

// Columns that are metadata, not subject grades
const excludedColumns = new Set([
    "id", "avgUef1", "creditUef1", "avgUef2", "creditUef2",
    "avgUed", "creditUed", "avgUem", "creditUem",
    "avgUet", "creditUet", "creditSem", "avgSem", "rank"
]);

let semesterGradesCache = {};
let activeSem = 1;

// Init
document.addEventListener("DOMContentLoaded", () => {
    buildDashboardProfile();
});

// Logout
function handlePortalLogout() {
    localStorage.clear();
    window.location.replace("login.html");
}

// Page navigation
function navigate(page, el) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

    document.getElementById("page-" + page).classList.add("active");
    el.classList.add("active");

    const labels = { home: "Dashboard Overview", records: "Academic Logs" };
    document.getElementById("breadcrumb-label").textContent = labels[page] || page;

    if (page === "records") {
        renderTranscriptTable(activeSem);
    }
}

// Dashboard profile card
function buildDashboardProfile() {
    const fullName = `${currentStudent.fname} ${currentStudent.lname}`;
    document.getElementById("welcome-text").innerHTML =
        `Welcome, <span>${fullName}</span>`;

    const groupNumber  = currentStudent.groupNum ?? currentStudent.group ?? "—";
    const groupDisplay = groupNumber !== "—"
        ? `Group ${String(groupNumber).padStart(2, "0")}`
        : "—";

    function ordinalYear(n) {
        const suffix = ["th", "st", "nd", "rd"];
        return `${n}${suffix[n] ?? "th"} Year`;
    }

    const layoutMap = [
        ["Field",                currentStudent.field,                       false],
        ["Major",                currentStudent.major,                       false],
        ["Specialty",            currentStudent.specialty,                   false],
        ["Track",                currentStudent.cycle,                       false],
        ["Academic Level",       ordinalYear(currentStudent.level),          false],
        ["Group",                groupDisplay,                               false],
        ["Global Rank Position", academicMetrics ? `#${academicMetrics.rank}` : "N/A", true]
    ];

    document.getElementById("profile-details").innerHTML = layoutMap.map(
        ([lbl, val, high]) => `
        <div class="detail-row">
            <div class="detail-label">${lbl}</div>
            <div class="detail-value ${high ? "accent" : ""}">${val ?? "—"}</div>
        </div>`
    ).join("");
}

// Semester data fetch (with cache)
async function fetchSemesterData(semNum) {
    if (semesterGradesCache[semNum]) return semesterGradesCache[semNum];

    const url      = `${API_BASE}/api/portal/semester/${semNum}?studentId=${currentStudent.id}`;
    const response = await fetch(url);

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Could not load data for Semester ${semNum}.`);
    }

    const rawData = await response.json();
    semesterGradesCache[semNum] = rawData;
    return rawData;
}

// Semester tab selection
function selectSem(semIndex, tabElement) {
    if (tabElement.classList.contains("locked")) return;
    if (activeSem === semIndex && semesterGradesCache[semIndex]) return;

    document.querySelectorAll(".sem-tab:not(.locked)").forEach(t => t.classList.remove("active"));
    tabElement.classList.add("active");
    activeSem = semIndex;
    renderTranscriptTable(semIndex);
}

// Transcript table renderer
async function renderTranscriptTable(semNum) {
    const container = document.getElementById("sem-content");
    container.innerHTML = `
        <div style="color:var(--text-muted);font-family:var(--font-mono);font-size:13px;padding:10px;">
            Syncing with structural database engine...
        </div>`;

    try {
        const rawData = await fetchSemesterData(semNum);

        let rows = "";
        for (const [key, value] of Object.entries(rawData)) {
            if (excludedColumns.has(key) || value === null || value === undefined) continue;
            const label  = subjectRegistry[key] || key.toUpperCase();
            const passed = Number(value) >= 10;
            rows += `
                <tr>
                    <td style="text-align:left;padding:16px 24px;">
                        <div>${label}</div>
                    </td>
                    <td style="text-align:right;padding:16px 24px;">
                        <span class="grade-num ${passed ? "pass" : "fail"}">
                            ${Number(value).toFixed(2)}
                        </span>
                    </td>
                </tr>`;
        }

        const avg    = rawData.avgSem;
        const isPass = Number(avg) >= 10;

        container.innerHTML = `
            <div class="ue-table-container" style="margin-top:20px;">
                <table class="grade-table">
                    <thead>
                        <tr>
                            <th style="text-align:left;padding:12px 24px;">Module Description</th>
                            <th style="text-align:right;padding:12px 24px;">Obtained Grade</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div class="sem-summary">
                <div class="summary-card highlight">
                    <div class="s-label">Semester Average</div>
                    <div class="s-value">
                        ${Number(avg).toFixed(2)}
                        <span style="font-size:14px;color:var(--text-muted)">/20</span>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="s-label">Sequence Rank</div>
                    <div class="s-value">#${rawData.rank ?? "N/A"}</div>
                </div>
                <div class="summary-card">
                    <div class="s-label">Accrued Credits</div>
                    <div class="s-value">${rawData.creditSem ?? 0} / 30</div>
                </div>
                <div class="summary-card ${isPass ? "status-pass" : "status-fail"}">
                    <div class="s-label">Jury Final Verdict</div>
                    <div class="s-value" style="font-size:24px;letter-spacing:1px;">
                        ${isPass ? "ADMIS" : "AJOURNÉ"}
                    </div>
                </div>
            </div>`;

    } catch (err) {
        container.innerHTML = `
            <div style="color:var(--error);padding:20px;border-left:2px solid var(--error);
                        font-family:var(--font-mono);">
                Database Error: ${err.message}
            </div>`;
    }
}

// Animated background grid
(function () {
    const canvas = document.getElementById("bg-canvas");
    const ctx    = canvas.getContext("2d");
    let W, H, points;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        generateGrid();
    }

    function generateGrid() {
        const spacing = 65;
        points = [];
        for (let r = 0; r <= Math.ceil(H / spacing); r++) {
            for (let c = 0; c <= Math.ceil(W / spacing); c++) {
                points.push({
                    x: c * spacing, y: r * spacing,
                    ox: c * spacing, oy: r * spacing,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.25 + Math.random() * 0.35,
                    range: 5 + Math.random() * 5
                });
            }
        }
    }

    let ticker = 0;
    function updateLoop() {
        ctx.clearRect(0, 0, W, H);
        ticker += 0.0035;
        points.forEach(p => {
            p.x = p.ox + Math.sin(ticker * p.speed + p.phase) * p.range;
            p.y = p.oy + Math.cos(ticker * p.speed + p.phase * 1.2) * p.range * 0.7;
            const dist     = Math.hypot(p.x - W / 2, p.y - H / 2);
            const alphaVal = Math.max(0, 0.15 - dist / (W * 0.95));
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${alphaVal.toFixed(3)})`;
            ctx.fill();
        });
        requestAnimationFrame(updateLoop);
    }

    window.addEventListener("resize", resize);
    resize();
    updateLoop();
})();
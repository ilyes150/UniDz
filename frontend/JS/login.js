const API_BASE = "";

if (localStorage.getItem("unidz_student")) {
    window.location.replace("home.html");
}

// Forward-button guard
history.replaceState(null, "", location.href);

const loginForm  = document.getElementById("login-form");
const errorBox   = document.getElementById("login-error");
const errorText  = document.getElementById("error-text");
const submitBtn  = document.getElementById("submit-btn");
const btnSpinner = document.getElementById("btn-spinner");
const btnLabel   = document.getElementById("btn-label");

function setLoading(loading) {
    submitBtn.disabled       = loading;
    btnSpinner.style.display = loading ? "block" : "none";
    btnLabel.textContent     = loading ? "Authenticating..." : "Establish Connection";
}

function showError(msg) {
    errorText.textContent = msg;
    errorBox.classList.add("visible");
}

function hideError() {
    errorBox.classList.remove("visible");
}

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (submitBtn.disabled) return;

    const user = document.getElementById("auth-username").value.trim();
    const pass = document.getElementById("auth-password").value;

    if (user.length < 5) {
        showError("Matricule must be at least 5 characters.");
        return;
    }

    hideError();
    setLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/portal/login`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ username: user, password: pass })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Authentication rejected. Invalid credentials.");
        }

        const data = await response.json();
        localStorage.setItem("unidz_student", JSON.stringify(data.student));
        localStorage.setItem("unidz_metrics",  JSON.stringify(data.metrics));
        window.location.href = "home.html";
    } catch (err) {
        showError(err.message);
        setLoading(false);
    }
});

// Animated background grid
(function () {
    const canvas = document.getElementById("bg-canvas");
    const ctx    = canvas.getContext("2d");
    let W, H, points;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        init();
    }

    function init() {
        const spacing = 72;
        points = [];
        for (let r = 0; r <= Math.ceil(H / spacing); r++) {
            for (let c = 0; c <= Math.ceil(W / spacing); c++) {
                points.push({
                    ox: c * spacing, oy: r * spacing,
                    x:  c * spacing, y:  r * spacing,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.2 + Math.random() * 0.3,
                    range: 4 + Math.random() * 5
                });
            }
        }
    }

    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        t += 0.003;

        points.forEach(p => {
            p.x = p.ox + Math.sin(t * p.speed + p.phase) * p.range;
            p.y = p.oy + Math.cos(t * p.speed + p.phase * 1.3) * p.range * 0.6;

            const dist  = Math.hypot(p.x - W / 2, p.y - H / 2);
            const alpha = Math.max(0, 0.18 - dist / (W * 0.9));

            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96,165,250,${alpha.toFixed(3)})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
})();
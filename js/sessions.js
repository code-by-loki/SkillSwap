// ========================================
// 1. STORAGE KEYS
// ========================================

const SESSIONS_KEY = "skillswapDemoSessions";
const SESSION_KEY = "skillswapDemoSession";


// ========================================
// 2. GET HTML ELEMENTS
// ========================================

const sessionsList = document.getElementById("sessionsList");
const emptyState = document.getElementById("emptyState");
const sessionFilter = document.getElementById("sessionFilter");

const totalSessions = document.getElementById("totalSessions");
const upcomingSessions = document.getElementById("upcomingSessions");
const completedSessions = document.getElementById("completedSessions");

const pageMessage = document.getElementById("pageMessage");


// ========================================
// 3. GET CURRENT USER
// ========================================

const currentUserId = sessionStorage.getItem(SESSION_KEY);


// ========================================
// 4. LOAD SESSIONS FROM LOCAL STORAGE
// ========================================

function getSessions() {
    try {
        const storedSessions = JSON.parse(
            localStorage.getItem(SESSIONS_KEY)
        );

        return Array.isArray(storedSessions) ? storedSessions : [];

    } catch (error) {
        console.error("Unable to load sessions:", error);
        return [];
    }
}


// ========================================
// 5. SAVE SESSIONS TO LOCAL STORAGE
// ========================================

function saveSessions(sessions) {
    localStorage.setItem(
        SESSIONS_KEY,
        JSON.stringify(sessions)
    );
}


// ========================================
// 6. GET CURRENT USER'S SESSIONS
// ========================================

function getMySessions() {
    const allSessions = getSessions();

    return allSessions.filter(function (session) {
        return String(session.userId) === String(currentUserId);
    });
}


// ========================================
// 7. UPDATE STATISTICS
// ========================================

function updateStatistics() {
    const sessions = getMySessions();

    const upcomingCount = sessions.filter(function (session) {
        return session.status === "Upcoming";
    }).length;

    const completedCount = sessions.filter(function (session) {
        return session.status === "Completed";
    }).length;

    totalSessions.textContent = sessions.length;
    upcomingSessions.textContent = upcomingCount;
    completedSessions.textContent = completedCount;
}


// ========================================
// 8. DISPLAY MESSAGE
// ========================================

function showMessage(message) {
    pageMessage.textContent = message;

    setTimeout(function () {
        pageMessage.textContent = "";
    }, 3000);
}


// ========================================
// 9. FORMAT DATE
// ========================================

function formatDate(dateValue) {
    if (!dateValue) {
        return "Date not scheduled";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Date not scheduled";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// ========================================
// 10. RENDER SESSION CARDS
// ========================================

function renderSessions() {
    const sessions = getMySessions();
    const selectedFilter = sessionFilter.value;

    let filteredSessions = sessions;

    if (selectedFilter === "upcoming") {
        filteredSessions = sessions.filter(function (session) {
            return session.status === "Upcoming";
        });
    }

    else if (selectedFilter === "completed") {
        filteredSessions = sessions.filter(function (session) {
            return session.status === "Completed";
        });
    }

    else if (selectedFilter === "cancelled") {
        filteredSessions = sessions.filter(function (session) {
            return session.status === "Cancelled";
        });
    }

    // Remove old cards but keep the empty-state element.
    sessionsList.replaceChildren();

    if (filteredSessions.length === 0) {
        sessionsList.appendChild(emptyState);

        const heading = emptyState.querySelector("h3");
        const description = emptyState.querySelector("p");

        if (sessions.length === 0) {
            heading.textContent = "No sessions yet";

            description.textContent =
                "Your scheduled skill-exchange sessions will appear here.";
        } else {
            heading.textContent = "No matching sessions";

            description.textContent =
                "Try selecting another filter to view your sessions.";
        }

        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;

    filteredSessions.forEach(function (session) {
        const card = document.createElement("article");
        card.className = "session-card";

        const title = document.createElement("h3");
        title.textContent = session.skill || "Skill Exchange";

        const partner = document.createElement("p");
        partner.textContent =
            "Learning partner: " + (session.partnerName || "Not specified");

        const date = document.createElement("p");
        date.textContent = "Date: " + formatDate(session.date);

        const time = document.createElement("p");
        time.textContent = "Time: " + (session.time || "Not scheduled");

        const status = document.createElement("span");
        status.className = "session-status";
        status.textContent = session.status;

        card.append(
            title,
            partner,
            date,
            time,
            status
        );

        const actions = document.createElement("div");
        actions.className = "session-actions";

        if (session.status === "Upcoming") {
            const completeButton = document.createElement("button");

            completeButton.type = "button";
            completeButton.textContent = "Mark Completed";

            completeButton.addEventListener("click", function () {
                updateSessionStatus(session.id, "Completed");
            });

            const cancelButton = document.createElement("button");

            cancelButton.type = "button";
            cancelButton.textContent = "Cancel Session";

            cancelButton.addEventListener("click", function () {
                const confirmed = confirm(
                    "Are you sure you want to cancel this session?"
                );

                if (confirmed) {
                    updateSessionStatus(session.id, "Cancelled");
                }
            });

            actions.append(completeButton, cancelButton);
            card.appendChild(actions);
        }

        sessionsList.appendChild(card);
    });
}


// ========================================
// 11. UPDATE SESSION STATUS
// ========================================

function updateSessionStatus(sessionId, newStatus) {
    const allSessions = getSessions();

    const sessionIndex = allSessions.findIndex(function (session) {
        return (
            String(session.id) === String(sessionId) &&
            String(session.userId) === String(currentUserId)
        );
    });

    if (sessionIndex === -1) {
        showMessage("Session not found.");
        return;
    }

    if (allSessions[sessionIndex].status !== "Upcoming") {
        showMessage("Only upcoming sessions can be updated.");
        return;
    }

    allSessions[sessionIndex].status = newStatus;

    saveSessions(allSessions);

    updateStatistics();
    renderSessions();

    showMessage("Session marked as " + newStatus.toLowerCase() + ".");
}


// ========================================
// 12. FILTER EVENT
// ========================================

sessionFilter.addEventListener("change", function () {
    renderSessions();
});


// ========================================
// 13. INITIALIZE PAGE
// ========================================

function initializeSessionsPage() {
    if (!currentUserId) {
        sessionsList.replaceChildren();

        const message = document.createElement("div");
        message.className = "empty-state";

        const heading = document.createElement("h3");
        heading.textContent = "Login required";

        const description = document.createElement("p");
        description.textContent =
            "Please log in to view your sessions.";

        const loginLink = document.createElement("a");
        loginLink.href = "login.html";
        loginLink.className = "primary-btn";
        loginLink.textContent = "Go to Login";

        message.append(heading, description, loginLink);
        sessionsList.appendChild(message);

        updateStatistics();
        return;
    }

    updateStatistics();
    renderSessions();
}


// Start the page.
initializeSessionsPage();


document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. STORAGE KEYS AND HTML ELEMENTS
    // ==========================================

    const SESSION_KEY = "skillswapDemoSession";
    const SESSIONS_KEY = "skillswapDemoSessions";

    const overallPercentage = document.getElementById("overallPercentage");
    const progressRing = document.getElementById("progressRing");
    const progressSummary = document.getElementById("progressSummary");

    const totalSessionsElement = document.getElementById("totalSessions");
    const completedSessionsElement = document.getElementById("completedSessions");
    const upcomingSessionsElement = document.getElementById("upcomingSessions");
    const skillsPractisedElement = document.getElementById("skillsPractised");

    const completionRate = document.getElementById("completionRate");
    const completionBar = document.getElementById("completionBar");
    const learningAdvice = document.getElementById("learningAdvice");

    const milestonesList = document.getElementById("milestonesList");
    const historyList = document.getElementById("progressSessionHistory");
    const logoutButton = document.getElementById("progressLogout");
    const progressMessage = document.getElementById("progressMessage");

    const currentUserId = sessionStorage.getItem(SESSION_KEY);

    // ==========================================
    // 2. SAFE STORAGE READER
    // ==========================================

    function readSessions() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(SESSIONS_KEY) || "[]"
            );

            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            console.error("Could not read sessions:", error);
            return [];
        }
    }

    // ==========================================
    // 3. HELPER FUNCTIONS
    // ==========================================

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined && text !== null) {
            element.textContent = text;
        }

        return element;
    }

    function formatDate(value) {
        if (!value) {
            return "Date not scheduled";
        }

        // The stored session date uses YYYY-MM-DD.
        const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? new Date(value + "T00:00:00")
            : new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Date not scheduled";
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function setText(element, value) {
        if (element) {
            element.textContent = value;
        }
    }

    // ==========================================
    // 4. OVERALL PROGRESS
    // ==========================================

    function renderProgress(sessions) {
        const total = sessions.length;

        const completed = sessions.filter(function (session) {
            return String(session.status).toLowerCase() === "completed";
        });

        const upcoming = sessions.filter(function (session) {
            return String(session.status).toLowerCase() === "upcoming";
        });

        // Percentage is based on completed sessions out of all sessions.
        const percentage = total === 0
            ? 0
            : Math.round((completed.length / total) * 100);

        setText(totalSessionsElement, total);
        setText(completedSessionsElement, completed.length);
        setText(upcomingSessionsElement, upcoming.length);
        setText(overallPercentage, percentage + "%");
        setText(completionRate, percentage + "%");

        if (progressRing) {
            progressRing.style.setProperty("--progress", percentage + "%");
            progressRing.setAttribute(
                "aria-label",
                "Overall learning progress: " + percentage + "%"
            );
        }

        if (completionBar) {
            completionBar.style.width = percentage + "%";
        }

        if (total === 0) {
            setText(progressSummary, "Your learning journey starts here.");
            setText(
                learningAdvice,
                "Schedule your first skill-exchange session to start tracking progress."
            );
        } else if (completed.length === total) {
            setText(progressSummary, "Amazing! All your sessions are completed.");
            setText(
                learningAdvice,
                "Fantastic work! Keep exploring new skills and schedule your next session."
            );
        } else {
            setText(
                progressSummary,
                completed.length + " of " + total + " sessions completed."
            );
            setText(
                learningAdvice,
                "Complete your upcoming sessions to increase your learning progress."
            );
        }

        // Count unique skills from completed sessions only.
        const uniqueSkills = new Set(
            completed.map(function (session) {
                return String(session.skill || "").trim().toLowerCase();
            }).filter(Boolean)
        );

        setText(skillsPractisedElement, uniqueSkills.size);

        renderMilestones(completed.length);
        renderHistory(sessions);
    }

    // ==========================================
    // 5. LEARNING MILESTONES
    // ==========================================

    function renderMilestones(completedCount) {
        const milestones = [
            {
                threshold: 1,
                icon: "🌱",
                title: "First Step",
                description: "Complete your first learning session."
            },
            {
                threshold: 5,
                icon: "🔥",
                title: "Consistency Builder",
                description: "Complete 5 learning sessions."
            },
            {
                threshold: 10,
                icon: "⭐",
                title: "Dedicated Learner",
                description: "Complete 10 learning sessions."
            },
            {
                threshold: 25,
                icon: "🏆",
                title: "SkillSwap Champion",
                description: "Complete 25 learning sessions."
            }
        ];

        milestonesList.replaceChildren();

        milestones.forEach(function (milestone) {
            const unlocked = completedCount >= milestone.threshold;

            const item = createElement(
                "div",
                "milestone-item" + (unlocked ? "" : " is-locked")
            );

            const badge = createElement(
                "div",
                "milestone-badge",
                unlocked ? milestone.icon : "🔒"
            );

            const details = document.createElement("div");
            const title = createElement("h3", "", milestone.title);
            const description = createElement(
                "p",
                "",
                unlocked
                    ? "Unlocked! " + milestone.description
                    : milestone.description
            );

            details.append(title, description);
            item.append(badge, details);
            milestonesList.appendChild(item);
        });
    }

    // ==========================================
    // 6. SESSION HISTORY
    // ==========================================

    function renderHistory(sessions) {
        historyList.replaceChildren();

        if (sessions.length === 0) {
            historyList.appendChild(
                createElement(
                    "p",
                    "progress-empty",
                    "No sessions yet. Visit Explore Skills to start learning."
                )
            );
            return;
        }

        // Show newest-created sessions first.
        const sortedSessions = [...sessions].sort(function (a, b) {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        sortedSessions.slice(0, 10).forEach(function (session) {
            const item = createElement("article", "history-item");
            const details = document.createElement("div");

            const title = createElement(
                "h3",
                "",
                session.skill || "Skill Exchange"
            );

            const date = createElement(
                "p",
                "",
                "Date: " + formatDate(session.date) +
                " · Time: " + (session.time || "Not scheduled")
            );

            const partnerName =
                String(session.userId) === String(currentUserId)
                    ? session.partnerName
                    : session.creatorName;

            const partner = createElement(
                "p",
                "",
                "Learning partner: " + (partnerName || "SkillSwap Member")
            );

            details.append(title, date, partner);

            const statusValue = String(session.status || "Upcoming");
            const status = createElement(
                "span",
                "history-status" +
                    (statusValue.toLowerCase() === "completed"
                        ? " completed"
                        : ""),
                statusValue
            );

            item.append(details, status);
            historyList.appendChild(item);
        });
    }

    // ==========================================
    // 7. LOGOUT
    // ==========================================

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            sessionStorage.removeItem(SESSION_KEY);
            window.location.href = "login.html";
        });
    }

    // ==========================================
    // 8. INITIALIZE
    // ==========================================

    if (!currentUserId) {
        setText(progressMessage, "Please log in to view your learning progress.");

        setText(totalSessionsElement, "0");
        setText(completedSessionsElement, "0");
        setText(upcomingSessionsElement, "0");
        setText(skillsPractisedElement, "0");
        setText(overallPercentage, "0%");
        setText(completionRate, "0%");

        if (progressRing) {
            progressRing.style.setProperty("--progress", "0%");
        }

        if (completionBar) {
            completionBar.style.width = "0%";
        }

        renderMilestones(0);
        renderHistory([]);

        return;
    }

    const allSessions = readSessions();

    // Include sessions where the current user is either participant.
    const mySessions = allSessions.filter(function (session) {
        return (
            String(session.userId) === String(currentUserId) ||
            String(session.partnerId) === String(currentUserId)
        );
    });

    renderProgress(mySessions);

});

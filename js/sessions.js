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

function createSessionUpdateNotification(session, action) {
    try {
        const notifications = JSON.parse(
            localStorage.getItem("skillswapNotifications") || "[]"
        );

        if (!Array.isArray(notifications)) {
            throw new Error("Invalid notification data");
        }

        const messageByAction = {
            rescheduled:
                "Your " + (session.skill || "skill exchange") +
                " session has been rescheduled to " +
                session.date + " at " + session.time + ".",

            cancelled:
                "Your " + (session.skill || "skill exchange") +
                " session scheduled for " +
                session.date + " at " + session.time +
                " has been cancelled.",

            completed:
                "Your " + (session.skill || "skill exchange") +
                " session has been marked as completed."
        };

        // Notify both participants.
        const userIds = [
            session.userId,
            session.partnerId
        ];

        userIds.forEach(function (userId) {
            if (!userId) return;

            notifications.push({
                id: crypto.randomUUID(),
                userId: String(userId),
                sessionId: String(session.id),
                requestId: session.requestId,
                type: "session-" + action,
                message: messageByAction[action],
                read: false,
                createdAt: new Date().toLocaleString()
            });
        });

        localStorage.setItem(
            "skillswapNotifications",
            JSON.stringify(notifications)
        );

    } catch (error) {
        console.error(
            "Could not create session update notification:",
            error
        );
    }
}


 // ========================================
 // 5A. SESSION REMINDER SYSTEM
 // ========================================

const NOTIFICATIONS_KEY = "skillswapNotifications";
const REMINDER_CHECK_INTERVAL = 30 * 1000; // 30 seconds

function getSessionStartDate(session) {
    if (!session.date || !session.time) {
        return null;
    }

    // Supports times such as "10:00 AM" and "10:00 PM".
    const match = session.time.trim().match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

    if (!match) {
        console.warn("Unsupported session time:", session.time);
        return null;
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3].toUpperCase();

    if (
        hours < 1 || hours > 12 ||
        minutes < 0 || minutes > 59
    ) {
        return null;
    }

    if (meridiem === "AM") {
        hours = hours === 12 ? 0 : hours;
    } else {
        hours = hours === 12 ? 12 : hours + 12;
    }

    const parts = session.date.split("-").map(Number);

    if (parts.length !== 3) {
        return null;
    }

    const startDate = new Date(
        parts[0],
        parts[1] - 1,
        parts[2],
        hours,
        minutes,
        0,
        0
    );

    if (
        startDate.getFullYear() !== parts[0] ||
        startDate.getMonth() !== parts[1] - 1 ||
        startDate.getDate() !== parts[2]
    ) {
        return null;
    }

    return startDate;
}

function createReminderNotification(session, reminderType) {
    let notifications = [];

    try {
        notifications = JSON.parse(
            localStorage.getItem(NOTIFICATIONS_KEY) || "[]"
        );

        if (!Array.isArray(notifications)) {
            notifications = [];
        }
    } catch (error) {
        console.error("Could not read notifications:", error);
        return;
    }

    const reminderKey =
        "session-reminder-" + reminderType + "-" + session.id;

    // Do not create the same reminder more than once.
    const alreadyExists = notifications.some(function (item) {
        return (
            String(item.userId) === String(currentUserId) &&
            item.reminderKey === reminderKey
        );
    });

    if (alreadyExists) {
        return;
    }

    const messages = {
        "24h": "Reminder: Your " + (session.skill || "skill exchange") +
            " session is in 24 hours, on " +
            session.date + " at " + session.time + ".",

        "1h": "Reminder: Your " + (session.skill || "skill exchange") +
            " session starts in 1 hour, at " + session.time + ".",

        "start": "Your " + (session.skill || "skill exchange") +
            " session is starting now!"
    };

    notifications.push({
        id: crypto.randomUUID(),
        userId: String(currentUserId),
        sessionId: String(session.id),
        requestId: session.requestId,
        type: "session-reminder",
        reminderKey: reminderKey,
        message: messages[reminderType],
        read: false,
        createdAt: new Date().toLocaleString()
    });

    try {
        localStorage.setItem(
            NOTIFICATIONS_KEY,
            JSON.stringify(notifications)
        );
    } catch (error) {
        console.error("Could not save reminder:", error);
    }
}

function checkSessionReminders() {
    if (!currentUserId) {
        return;
    }

    const now = Date.now();
    const sessions = getMySessions();

    sessions.forEach(function (session) {
        if (session.status !== "Upcoming") {
            return;
        }

        const startDate = getSessionStartDate(session);

        if (!startDate) {
            return;
        }

        const remaining = startDate.getTime() - now;

        // Only generate reminders in their intended time windows.
        if (remaining > 0 && remaining <= 24 * 60 * 60 * 1000 &&
            remaining > 60 * 60 * 1000) {
            createReminderNotification(session, "24h");
        }

        if (remaining > 0 && remaining <= 60 * 60 * 1000 &&
            remaining > 60 * 1000) {
            createReminderNotification(session, "1h");
        }

        if (remaining <= 60 * 1000 && remaining >= 0) {
            createReminderNotification(session, "start");
        }
    });
}

// Check immediately and then every 30 seconds.
checkSessionReminders();

setInterval(checkSessionReminders, REMINDER_CHECK_INTERVAL);

// Recheck when the browser tab becomes active.
document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
        checkSessionReminders();
    }
});


 // ========================================
 // 6. GET CURRENT USER'S SESSIONS
 // ========================================

function getMySessions() {
    const allSessions = getSessions();

    return allSessions.filter(function (session) {
        return (
            String(session.userId) === String(currentUserId) ||
            String(session.partnerId) === String(currentUserId)
        );
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

        const partnerName =
        String(session.userId) === String(currentUserId)
        ? session.partnerName
        : session.creatorName;

        partner.textContent =
        "Learning partner: " + (partnerName || "Not specified");


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

            // Reschedule Session button
const rescheduleButton = document.createElement("button");

rescheduleButton.type = "button";
rescheduleButton.textContent = "Reschedule Session";

rescheduleButton.addEventListener("click", function () {
    rescheduleSession(session.id);
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

            actions.append(
            completeButton,
            rescheduleButton,
            cancelButton
           );
            card.appendChild(actions);
        }

        sessionsList.appendChild(card);
    });
}




function rescheduleSession(sessionId) {
    const allSessions = getSessions();

    const session = allSessions.find(function (item) {
        return (
            String(item.id) === String(sessionId) &&
            String(item.userId) === String(currentUserId)
        );
    });

    if (!session) {
        showMessage(
            "Only the session creator can reschedule this session."
        );
        return;
    }

    if (session.status !== "Upcoming") {
        showMessage("Only upcoming sessions can be rescheduled.");
        return;
    }

    const newDate = prompt(
        "Enter new session date (YYYY-MM-DD):",
        session.date
    );

    if (!newDate) return;

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(newDate)) {
        alert("Enter date in YYYY-MM-DD format.");
        return;
    }

    const parts = newDate.split("-").map(Number);

    const parsedDate = new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

    if (
        parsedDate.getFullYear() !== parts[0] ||
        parsedDate.getMonth() !== parts[1] - 1 ||
        parsedDate.getDate() !== parts[2]
    ) {
        alert("Please enter a valid date.");
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
        alert("Please select today or a future date.");
        return;
    }

    const newTime = prompt(
        "Enter new session time (example: 10:00 AM):",
        session.time
    );

    if (!newTime || !newTime.trim()) return;

    session.date = newDate;
    session.time = newTime.trim();

    saveSessions(allSessions);

    // Notify both participants about the new schedule.
    createSessionUpdateNotification(session, "rescheduled");

    // Recheck reminders using the updated date and time.
    checkSessionReminders();

    updateStatistics();
    renderSessions();

    showMessage("Session rescheduled successfully!");
}


// ========================================
// 11. UPDATE SESSION STATUS
// ========================================


function updateSessionStatus(sessionId, newStatus) {
    if (!["Completed", "Cancelled"].includes(newStatus)) {
        return;
    }

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

    const updatedSession = allSessions[sessionIndex];

    if (updatedSession.status !== "Upcoming") {
        showMessage("Only upcoming sessions can be updated.");
        return;
    }

    updatedSession.status = newStatus;

    saveSessions(allSessions);

    if (newStatus === "Cancelled") {
        createSessionUpdateNotification(
            updatedSession,
            "cancelled"
        );
    } else if (newStatus === "Completed") {
        createSessionUpdateNotification(
            updatedSession,
            "completed"
        );
    }

    updateStatistics();
    renderSessions();

    showMessage(
        "Session marked as " + newStatus.toLowerCase() + "."
    );
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

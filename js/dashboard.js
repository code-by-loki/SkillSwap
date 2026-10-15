
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. GET HTML ELEMENTS
    // ==========================================

    const dashboardName = document.getElementById("dashboardName");
    const dashboardSkills = document.getElementById("dashboardSkills");
    const dashboardRequests = document.getElementById("dashboardRequests");
    const dashboardSessions = document.getElementById("dashboardSessions");
    const dashboardLogout = document.getElementById("dashboardLogout");
    const dashboardMessage = document.getElementById("dashboardMessage");

    const mySkillsCount = document.getElementById("mySkillsCount");
    const pendingRequestsCount = document.getElementById("pendingRequestsCount");
    const upcomingSessionsCount = document.getElementById("upcomingSessionsCount");
    const learningProgress = document.getElementById("learningProgress");

    // ==========================================
    // 2. STORAGE KEYS
    // ==========================================

    const SESSION_KEY = "skillswapDemoSession";
    const USERS_KEY = "skillswapDemoUsers";
    const PROFILE_KEY = "skillswapDemoProfileDetailsByUser";
    const REQUESTS_KEY = "skillswapDemoRequests";
    const SESSIONS_KEY = "skillswapDemoSessions";
    const PROGRESS_KEY = "skillswapDemoProgress";

    const currentUserId = sessionStorage.getItem(SESSION_KEY);

    // ==========================================
    // 3. SAFE STORAGE READER
    // ==========================================

    function readStorage(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value === null ? fallback : value;
        } catch (error) {
            console.warn("Could not read:", key, error);
            return fallback;
        }
    }

    // ==========================================
    // 4. GET CURRENT USER PROFILE
    // ==========================================

    const users = readStorage(USERS_KEY, []);
    const profiles = readStorage(PROFILE_KEY, {});

    const currentUser = users.find(function (user) {
        return String(user.id) === String(currentUserId);
    });

    const profile = profiles[String(currentUserId)] || {};

    if (dashboardName) {
        dashboardName.textContent =
            profile.name ||
            (currentUser && currentUser.name) ||
            "Learner";
    }

    // ==========================================
    // 5. MY SKILLS
    // ==========================================

    function normalizeSkills(value) {
        if (Array.isArray(value)) {
            return value.map(function (skill) {
                return String(skill).trim();
            }).filter(Boolean);
        }

        if (typeof value === "string") {
            return value.split(",").map(function (skill) {
                return skill.trim();
            }).filter(Boolean);
        }

        return [];
    }

    const teachSkills = normalizeSkills(profile.teachSkills);
    const learnSkills = normalizeSkills(profile.learnSkills);

    const allSkills = [...new Set([...teachSkills, ...learnSkills])];

    if (mySkillsCount) {
        mySkillsCount.textContent = allSkills.length;
    }

    if (dashboardSkills) {
        dashboardSkills.replaceChildren();

        if (allSkills.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-state";
            empty.textContent = "Your skills will appear here.";
            dashboardSkills.appendChild(empty);
        } else {
            allSkills.slice(0, 4).forEach(function (skill) {
                const item = document.createElement("div");
                item.className = "dashboard-skill-item";

                const name = document.createElement("h3");
                name.textContent = skill;

                const type = document.createElement("p");
                type.textContent =
                    teachSkills.includes(skill) &&
                    learnSkills.includes(skill)
                        ? "Teaching & Learning"
                        : teachSkills.includes(skill)
                            ? "Teaching"
                            : "Learning";

                item.append(name, type);
                dashboardSkills.appendChild(item);
            });
        }
    }

    // ==========================================
    // 6. REQUESTS
    // ==========================================

    const allRequests = readStorage(REQUESTS_KEY, []);

    const myRequests = allRequests.filter(function (request) {
        return (
            String(request.receiverId) === String(currentUserId) ||
            String(request.senderId) === String(currentUserId)
        );
    });

    const pendingRequests = myRequests.filter(function (request) {
        return (request.status || "Pending") === "Pending";
    });

    if (pendingRequestsCount) {
        pendingRequestsCount.textContent = pendingRequests.length;
    }

    if (dashboardRequests) {
        dashboardRequests.replaceChildren();

        if (myRequests.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-state";
            empty.textContent = "Your requests will appear here.";
            dashboardRequests.appendChild(empty);
        } else {
            myRequests.slice(-3).reverse().forEach(function (request) {
                const item = document.createElement("div");
                item.className = "dashboard-request-item";

                const title = document.createElement("h3");
                title.textContent =
                    request.wantedSkill || "Skill Exchange";

                const details = document.createElement("p");

                const isReceiver =
                    String(request.receiverId) === String(currentUserId);

                details.textContent =
                    (isReceiver ? "From: " : "To: ") +
                    (isReceiver
                        ? request.userName
                        : request.receiverName || "SkillSwap Member") +
                    " · " +
                    (request.status || "Pending");

                item.append(title, details);
                dashboardRequests.appendChild(item);
            });
        }
    }

    // ==========================================
    // 7. UPCOMING SESSIONS
    // ==========================================

    const allSessions = readStorage(SESSIONS_KEY, []);

    const mySessions = allSessions.filter(function (session) {
        return (
            String(session.userId) === String(currentUserId) ||
            String(session.partnerId) === String(currentUserId)
        );
    });

    const upcomingSessions = mySessions.filter(function (session) {
        return (session.status || "").toLowerCase() === "upcoming";
    });

    if (upcomingSessionsCount) {
        upcomingSessionsCount.textContent = upcomingSessions.length;
    }

    if (dashboardSessions) {
        dashboardSessions.replaceChildren();

        if (upcomingSessions.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-state";
            empty.textContent = "Your upcoming sessions will appear here.";
            dashboardSessions.appendChild(empty);
        } else {
            upcomingSessions.slice(0, 3).forEach(function (session) {
                const item = document.createElement("div");
                item.className = "dashboard-session-item";

                const title = document.createElement("h3");
                title.textContent = session.skill || "Skill Exchange";

                const partner = document.createElement("p");
                const partnerName =
                    String(session.userId) === String(currentUserId)
                        ? session.partnerName
                        : session.creatorName;

                partner.textContent =
                    "Learning partner: " +
                    (partnerName || "SkillSwap Member");

                const date = document.createElement("p");
                date.textContent =
                    "Date: " +
                    (session.date
                        ? new Date(session.date + "T00:00:00").toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" }
                        )
                        : "Not scheduled");

                const time = document.createElement("p");
                time.textContent = "Time: " + (session.time || "Not scheduled");

                item.append(title, partner, date, time);
                dashboardSessions.appendChild(item);
            });
        }
    }

    // ==========================================
    // 8. LEARNING PROGRESS
    // ==========================================

    const progressData = readStorage(PROGRESS_KEY, null);

    if (learningProgress) {
        let percentage = 0;

        if (typeof progressData === "number") {
            percentage = progressData;
        } else if (progressData && typeof progressData === "object") {
            const userProgress = progressData[String(currentUserId)];

            if (typeof userProgress === "number") {
                percentage = userProgress;
            } else if (
                userProgress &&
                typeof userProgress.percentage === "number"
            ) {
                percentage = userProgress.percentage;
            }
        }

        learningProgress.textContent =
            Math.max(0, Math.min(100, percentage)) + "%";
    }

    // ==========================================
    // 9. LOGOUT
    // ==========================================

    if (dashboardLogout) {
        dashboardLogout.addEventListener("click", function () {
            sessionStorage.removeItem(SESSION_KEY);
            window.location.href = "login.html";
        });
    }

    // ==========================================
    // 10. DASHBOARD MESSAGE
    // ==========================================

    if (dashboardMessage) {
        dashboardMessage.textContent = currentUserId
            ? ""
            : "Please log in to view your personalized dashboard.";
    }

});

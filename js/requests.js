
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. GET HTML ELEMENTS
    // ==========================================

    const requestsList = document.getElementById("requestsList");
    const emptyState = document.getElementById("emptyState");
    const totalRequests = document.getElementById("totalRequests");
    const pendingRequests = document.getElementById("pendingRequests");
    const acceptedRequests = document.getElementById("acceptedRequests");
    const refreshButton = document.getElementById("refreshButton");
    const pageMessage = document.getElementById("pageMessage");

    // ==========================================
    // 2. STORAGE KEYS
    // ==========================================

    const storageKey = "skillswapDemoRequests";
    const notificationStorageKey = "skillswapNotifications";
    const sessionsStorageKey = "skillswapDemoSessions";
    const sessionKey = "skillswapDemoSession";

    // ==========================================
    // 3. GET REQUESTS FROM LOCAL STORAGE
    // ==========================================

    function getRequests() {
        try {
            const savedData = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            return Array.isArray(savedData) ? savedData : [];

        } catch (error) {
            console.error("Could not read requests:", error);

            pageMessage.textContent =
                "Could not read saved requests from browser storage.";

            return [];
        }
    }

    // ==========================================
    // 4. SAVE REQUESTS
    // ==========================================

    function saveRequests(requests) {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(requests)
            );

            return true;

        } catch (error) {
            console.error("Could not save requests:", error);

            pageMessage.textContent =
                "Could not save changes. Check your browser storage.";

            return false;
        }
    }

    // ==========================================
    // 5. CREATE NOTIFICATION
    // ==========================================

    function createNotification(request, newStatus) {
        try {
            const notifications = JSON.parse(
                localStorage.getItem(notificationStorageKey) || "[]"
            );

            if (!Array.isArray(notifications)) {
                throw new Error("Invalid notification data");
            }

            const receiverName =
                request.receiverName || "Another user";

            const notification = {
                id: Date.now().toString(),
                userId: request.senderId,
                requestId: request.id,
                type: "request-status",

                message:
                    "Your request to learn " +
                    (request.wantedSkill || "a skill") +
                    " has been " +
                    newStatus.toLowerCase() +
                    " by " +
                    receiverName +
                    ".",

                read: false,
                createdAt: new Date().toLocaleString()
            };

            notifications.push(notification);

            localStorage.setItem(
                notificationStorageKey,
                JSON.stringify(notifications)
            );

        } catch (error) {
            console.error("Could not create notification:", error);
        }
    }

    // ==========================================
    // 6. CREATE SESSION
    // ==========================================

    function createSession(request) {

        const currentUserId = sessionStorage.getItem(sessionKey);

        if (!currentUserId) {
            alert("Please log in again.");
            return;
        }

        if (request.status !== "Accepted") {
            alert("Only accepted requests can create a session.");
            return;
        }

        const sessionDate = prompt(
            "Enter session date (YYYY-MM-DD):"
        );

        if (!sessionDate) {
            return;
        }

        // Validate date format and actual calendar date.
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (!datePattern.test(sessionDate)) {
            alert("Please enter the date in YYYY-MM-DD format.");
            return;
        }

        const dateParts = sessionDate.split("-").map(Number);
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        const parsedDate = new Date(year, month - 1, day);

        if (
            parsedDate.getFullYear() !== year ||
            parsedDate.getMonth() !== month - 1 ||
            parsedDate.getDate() !== day
        ) {
            alert("Please enter a valid calendar date.");
            return;
        }

        // Prevent scheduling a session in the past.
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (parsedDate < today) {
            alert("Please select today or a future date.");
            return;
        }

        const sessionTime = prompt(
            "Enter session time (example: 10:00 AM):"
        );

        if (!sessionTime || !sessionTime.trim()) {
            return;
        }

        try {
            const savedSessions = JSON.parse(
                localStorage.getItem(sessionsStorageKey) || "[]"
            );

            if (!Array.isArray(savedSessions)) {
                throw new Error("Invalid sessions data");
            }

            const newSession = {
                id: Date.now().toString(),
                requestId: request.id,

                // The person creating the session.
                userId: currentUserId,

                // The person who sent the original request.
                partnerId: request.senderId,

                partnerName: request.userName || "SkillSwap Member",
                creatorName: request.receiverName || "SkillSwap Member",

                skill: request.wantedSkill || "Skill Exchange",
                offeredSkill: request.offeredSkill || "Not specified",

                date: sessionDate,
                time: sessionTime.trim(),
                status: "Upcoming",
                createdAt: new Date().toISOString()
            };

            savedSessions.push(newSession);

            localStorage.setItem(
                sessionsStorageKey,
                JSON.stringify(savedSessions)
            );

            alert("Session created successfully!");






            

            // Correct page navigation.
            window.location.href = "sessions.html";

        } catch (error) {
            console.error("Could not create session:", error);

            alert(
                "Could not save the session. Please check browser storage."
            );
        }
    }

    // ==========================================
    // 7. CREATE HTML ELEMENTS SAFELY
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

    // ==========================================
    // 8. FORMAT DATE
    // ==========================================

    function formatDate(dateString) {
        if (!dateString) {
            return "Date unavailable";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleString();
    }

    // ==========================================
    // 9. ACCEPT OR REJECT REQUEST
    // ==========================================

    function updateStatus(requestId, newStatus) {

        if (!["Accepted", "Rejected"].includes(newStatus)) {
            return;
        }

        const requests = getRequests();
        const currentUserId = sessionStorage.getItem(sessionKey);

        if (!currentUserId) {
            pageMessage.textContent = "Please log in again.";
            return;
        }

        const request = requests.find(function (item) {
            return String(item.id) === String(requestId);
        });

        if (!request) {
            pageMessage.textContent =
                "Request not found. Please refresh the page.";
            return;
        }

        // Only the intended receiver can update the request.
        if (String(request.receiverId) !== String(currentUserId)) {
            pageMessage.textContent =
                "You cannot update another user's request.";
            return;
        }

        if ((request.status || "Pending") !== "Pending") {
            pageMessage.textContent =
                "This request has already been processed.";

            renderRequests();
            return;
        }

        request.status = newStatus;

        if (saveRequests(requests)) {

            createNotification(request, newStatus);

            pageMessage.textContent =
                "Request " + newStatus.toLowerCase() + " successfully!";

            renderRequests();
        }
    }

    // ==========================================
    // 10. RENDER REQUESTS
    // ==========================================

    function renderRequests() {

        const allRequests = getRequests();
        const currentUserId = sessionStorage.getItem(sessionKey);

        requestsList.replaceChildren();
        pageMessage.textContent = "";

        if (!currentUserId) {

            totalRequests.textContent = "0";
            pendingRequests.textContent = "0";
            acceptedRequests.textContent = "0";

            emptyState.hidden = false;

            pageMessage.textContent =
                "Please log in to view your requests.";

            return;
        }

        // Display only requests sent TO the logged-in user.
        const requests = allRequests.filter(function (request) {
            return String(request.receiverId) === String(currentUserId);
        });

        totalRequests.textContent = requests.length;

        pendingRequests.textContent = requests.filter(function (request) {
            return (request.status || "Pending") === "Pending";
        }).length;

        acceptedRequests.textContent = requests.filter(function (request) {
            return request.status === "Accepted";
        }).length;

        emptyState.hidden = requests.length > 0;

        requests.forEach(function (request) {

            // Request card.
            const card = createElement("article", "request-card");
            const cardTop = createElement("div", "request-card-top");
            const user = createElement("div", "request-user");

            const userName =
                typeof request.userName === "string" &&
                request.userName.trim()
                    ? request.userName
                    : "SkillSwap Member";

            // User avatar.
            const avatar = createElement(
                "div",
                "request-avatar",
                userName.charAt(0).toUpperCase()
            );

            const userInfo = createElement("div");

            const name = createElement("h3", "", userName);

            const date = createElement(
                "p",
                "request-date",
                "Sent: " + formatDate(request.createdAt)
            );

            userInfo.append(name, date);
            user.append(avatar, userInfo);

            // Request status badge.
            const status = request.status || "Pending";

            let statusClass = "status-pending";

            if (status === "Accepted") {
                statusClass = "status-accepted";
            } else if (status === "Rejected") {
                statusClass = "status-rejected";
            }

            const statusBadge = createElement(
                "span",
                "request-status " + statusClass,
                status
            );

            cardTop.append(user, statusBadge);

            // Skill details.
            const skills = createElement("div", "request-skills");

            const wantedBox = createElement("div", "skill-box");

            wantedBox.append(
                createElement("span", "", "Wants to learn"),
                createElement(
                    "strong",
                    "",
                    request.wantedSkill || "Not specified"
                )
            );

            const offeredBox = createElement("div", "skill-box");

            offeredBox.append(
                createElement("span", "", "Offers to teach"),
                createElement(
                    "strong",
                    "",
                    request.offeredSkill || "Not specified"
                )
            );

            skills.append(wantedBox, offeredBox);
            card.append(cardTop, skills);

            // Pending requests: Accept and Reject buttons.
            if (status === "Pending") {

                const actions = createElement("div", "request-actions");

                const acceptButton = createElement(
                    "button",
                    "accept-button",
                    "Accept"
                );

                acceptButton.type = "button";

                acceptButton.addEventListener("click", function () {
                    updateStatus(request.id, "Accepted");
                });

                const rejectButton = createElement(
                    "button",
                    "reject-button",
                    "Reject"
                );

                rejectButton.type = "button";

                rejectButton.addEventListener("click", function () {
                    updateStatus(request.id, "Rejected");
                });

                actions.append(acceptButton, rejectButton);
                card.append(actions);

            } else {

                card.append(
                    createElement(
                        "p",
                        "request-completed",
                        "This request has been " +
                        status.toLowerCase() +
                        "."
                    )
                );

                // Accepted requests: Create Session button.
                if (status === "Accepted") {

                    const createButton = createElement(
                        "button",
                        "accept-button",
                        "Create Session"
                    );

                    createButton.type = "button";

                    createButton.addEventListener("click", function () {
                        createSession(request);
                    });

                    card.append(createButton);
                }
            }

            requestsList.append(card);
        });
    }

    // ==========================================
    // 11. REFRESH BUTTON
    // ==========================================

    if (refreshButton) {
        refreshButton.addEventListener("click", renderRequests);
    }

    // ==========================================
    // 12. INITIAL PAGE LOAD
    // ==========================================

    renderRequests();

});

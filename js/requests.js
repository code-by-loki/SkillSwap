
document.addEventListener("DOMContentLoaded", function () {
    const requestsList = document.getElementById("requestsList");
    const emptyState = document.getElementById("emptyState");
    const totalRequests = document.getElementById("totalRequests");
    const pendingRequests = document.getElementById("pendingRequests");
    const acceptedRequests = document.getElementById("acceptedRequests");
    const refreshButton = document.getElementById("refreshButton");
    const pageMessage = document.getElementById("pageMessage");

    const storageKey = "skillswapDemoRequests";
    const notificationStorageKey = "skillswapNotifications";

    function getRequests() {
        try {
            const savedData = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            return Array.isArray(savedData) ? savedData : [];
        } catch (error) {
            pageMessage.textContent =
                "Could not read saved requests from browser storage.";
            return [];
        }
    }

    function saveRequests(requests) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(requests));
            return true;
        } catch (error) {
            pageMessage.textContent =
                "Could not save changes. Check your browser storage.";
            return false;
        }
    }

    // Create a notification when a request status changes.
    function createNotification(request, newStatus) {
        try {
            const savedData = JSON.parse(
                localStorage.getItem(notificationStorageKey) || "[]"
            );

            const notifications = Array.isArray(savedData)
                ? savedData
                : [];

            notifications.unshift({
                id: Date.now().toString() + Math.random().toString(36).slice(2),
                message:
                    "The request from " +
                    (request.userName || "SkillSwap Member") +
                    " for " +
                    (request.wantedSkill || "a skill") +
                    " has been " +
                    newStatus.toLowerCase() +
                    ".",
                read: false,
                createdAt: new Date().toLocaleString()
            });

            localStorage.setItem(
                notificationStorageKey,
                JSON.stringify(notifications)
            );

            return true;
        } catch (error) {
            console.error("Could not save notification:", error);
            return false;
        }
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

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

    function updateStatus(index, newStatus) {
        const requests = getRequests();

        if (!requests[index]) {
            pageMessage.textContent = "Request not found. Please refresh.";
            return;
        }

        const request = requests[index];

        if (request.status !== "Pending" && request.status) {
            pageMessage.textContent =
                "This request has already been processed.";
            renderRequests();
            return;
        }

        request.status = newStatus;

        if (saveRequests(requests)) {
            const notificationSaved = createNotification(request, newStatus);

            pageMessage.textContent = notificationSaved
                ? "Request " + newStatus.toLowerCase() +
                  ". Notification created."
                : "Request status updated, but notification could not be saved.";

            renderRequests();
        }
    }

    function renderRequests() {
        const requests = getRequests();

        requestsList.replaceChildren();
        pageMessage.textContent = "";

        totalRequests.textContent = requests.length;

        pendingRequests.textContent = requests.filter(function (request) {
            return (request.status || "Pending") === "Pending";
        }).length;

        acceptedRequests.textContent = requests.filter(function (request) {
            return request.status === "Accepted";
        }).length;

        emptyState.hidden = requests.length > 0;

        requests.forEach(function (request, index) {
            const card = createElement("article", "request-card");
            const cardTop = createElement("div", "request-card-top");
            const user = createElement("div", "request-user");

            const userName =
                typeof request.userName === "string" &&
                request.userName.trim()
                    ? request.userName
                    : "SkillSwap Member";

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

            const status = request.status || "Pending";
            const statusClass =
                status === "Accepted"
                    ? "status-accepted"
                    : status === "Rejected"
                        ? "status-rejected"
                        : "status-pending";

            const statusBadge = createElement(
                "span",
                "request-status " + statusClass,
                status
            );

            cardTop.append(user, statusBadge);

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

            if (status === "Pending") {
                const actions = createElement("div", "request-actions");

                const acceptButton = createElement(
                    "button",
                    "accept-button",
                    "Accept"
                );
                acceptButton.type = "button";

                acceptButton.addEventListener("click", function () {
                    updateStatus(index, "Accepted");
                });

                const rejectButton = createElement(
                    "button",
                    "reject-button",
                    "Reject"
                );
                rejectButton.type = "button";

                rejectButton.addEventListener("click", function () {
                    updateStatus(index, "Rejected");
                });

                actions.append(acceptButton, rejectButton);
                card.append(actions);
            } else {
                card.append(
                    createElement(
                        "p",
                        "request-completed",
                        "This request has been " + status.toLowerCase() + "."
                    )
                );
            }

            requestsList.append(card);
        });
    }

    refreshButton.addEventListener("click", renderRequests);

    renderRequests();
});

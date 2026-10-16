/* =========================================
   SKILLSWAP HOME PAGE JAVASCRIPT
========================================= */


/* 1. Wait until HTML is fully loaded */

document.addEventListener("DOMContentLoaded", function () {

    console.log("SkillSwap Home Page Loaded!");


    /* =====================================
       2. SMOOTH SCROLL FOR SECTION LINKS
    ===================================== */

    const sectionLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    sectionLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            // Ignore links containing only #
            if (targetId === "#") {
                return;
            }

            const targetSection = document.querySelector(targetId);

            // Scroll only if the target exists
            if (targetSection) {

                event.preventDefault();

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================
       3. HERO BUTTON CLICK EFFECT
    ===================================== */

    const heroButtons = document.querySelectorAll(
        ".hero-buttons a"
    );

    heroButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log(
                "Hero button clicked:",
                this.textContent.trim()
            );

        });

    });


    /* =====================================
       4. SKILL CARD INTERACTIONS
    ===================================== */

    const skillCards = document.querySelectorAll(
        ".skill-card"
    );

    skillCards.forEach(function (card) {

        card.addEventListener("mouseenter", function () {

            console.log(
                "Exploring skill:",
                this.querySelector("h3")?.textContent
            );

        });

    });


    /* =====================================
       5. CURRENT YEAR IN FOOTER
    ===================================== */

    const yearElement = document.getElementById(
        "currentYear"
    );

    if (yearElement) {

        yearElement.textContent = new Date().getFullYear();

    }


    /* =====================================
       6. BACK-TO-TOP BUTTON
    ===================================== */

    const backToTopButton = document.getElementById(
        "backToTop"
    );

    if (backToTopButton) {

        // Show button after scrolling down
        window.addEventListener("scroll", function () {

            if (window.scrollY > 350) {

                backToTopButton.classList.add("visible");

            } else {

                backToTopButton.classList.remove("visible");

            }

        });


        // Scroll to page top when clicked
        backToTopButton.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


/* =====================================
   7. NOTIFICATION SYSTEM
===================================== */

const notificationBell = document.getElementById("notificationBell");
const notificationPanel = document.getElementById("notificationPanel");
const notificationCount = document.getElementById("notificationCount");
const notificationList = document.getElementById("notificationList");
const markAllReadButton = document.getElementById("markAllRead");
const clearNotificationsButton = document.getElementById("clearNotifications");

const notificationStorageKey = "skillswapNotifications";

function getCurrentUserId() {
    return sessionStorage.getItem("skillswapDemoSession");
}

function getNotifications() {
    try {
        const data = JSON.parse(
            localStorage.getItem(notificationStorageKey) || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Unable to read notifications:", error);
        return [];
    }
}

function saveNotifications(notifications) {
    try {
        localStorage.setItem(
            notificationStorageKey,
            JSON.stringify(notifications)
        );
        return true;
    } catch (error) {
        alert("Unable to save notifications in this browser.");
        return false;
    }
}

function getCurrentUserNotifications() {
    const userId = getCurrentUserId();

    if (!userId) return [];

    return getNotifications().filter(function (notification) {
        return String(notification.userId) === String(userId);
    });
}

function updateNotificationCount(notifications) {
    const unreadCount = notifications.filter(function (notification) {
        return !notification.read;
    }).length;

    if (notificationCount) {
        notificationCount.textContent =
            unreadCount > 99 ? "99+" : unreadCount;

        notificationCount.hidden = unreadCount === 0;
    }
}

function markNotificationAsRead(notificationId) {
    const userId = getCurrentUserId();

    if (!userId) return;

    const notifications = getNotifications();

    const notification = notifications.find(function (item) {
        return String(item.id) === String(notificationId) &&
            String(item.userId) === String(userId);
    });

    if (notification && !notification.read) {
        notification.read = true;
        saveNotifications(notifications);
    }
}

function renderNotifications() {
    if (!notificationList) return;

    const notifications = getCurrentUserNotifications();

    notificationList.replaceChildren();

    if (notifications.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "no-notifications";
        emptyMessage.textContent = "No notifications yet.";
        notificationList.appendChild(emptyMessage);
    } else {
        notifications.slice().reverse().forEach(function (notification) {
            const item = document.createElement("div");
            item.className = "notification-item";

            if (!notification.read) {
                item.classList.add("unread");
            }

            item.tabIndex = 0;
            item.setAttribute("role", "button");

            item.setAttribute(
                "aria-label",
                (notification.message || "Notification") +
                (notification.read ? ", read" : ", unread")
            );

            const message = document.createElement("p");
            message.textContent = notification.message || "New notification";

            const time = document.createElement("small");
            time.textContent = notification.createdAt || "";

            item.append(message, time);

            function openNotification() {
                markNotificationAsRead(notification.id);

               
const text = notification.message || "";
const type = notification.type || "";

// Request notifications → Requests page
const isRequestNotification =
    type === "request-status" ||
    /wants to learn|request.*(accepted|rejected)|has been (accepted|rejected)|skill exchange request/i.test(text);

if (isRequestNotification) {
    window.location.href = "requests.html";
    return;
}

// Session notifications → Sessions page
const isSessionNotification =
    type.startsWith("session-") ||
    /session has been scheduled|session.*(cancelled|completed|rescheduled)|scheduled for/i.test(text);

if (isSessionNotification) {
    window.location.href = "sessions.html";
    return;
}

renderNotifications();

                renderNotifications();
            }

            item.addEventListener("click", openNotification);

            item.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openNotification();
                }
            });

            notificationList.appendChild(item);
        });
    }

    updateNotificationCount(notifications);
}

/* Open and close dropdown */
if (notificationBell && notificationPanel) {
    notificationBell.addEventListener("click", function (event) {
        event.stopPropagation();

        const isOpening = notificationPanel.hidden;
        notificationPanel.hidden = !isOpening;

        notificationBell.setAttribute(
            "aria-expanded",
            String(isOpening)
        );

        if (isOpening) {
            renderNotifications();
        }
    });

    document.addEventListener("click", function (event) {
        if (
            !event.target.closest(".notification-wrapper") &&
            !notificationPanel.hidden
        ) {
            notificationPanel.hidden = true;
            notificationBell.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            notificationPanel.hidden = true;
            notificationBell.setAttribute("aria-expanded", "false");
        }
    });
}

/* Mark current user's notifications as read */
if (markAllReadButton) {
    markAllReadButton.addEventListener("click", function (event) {
        event.stopPropagation();

        const userId = getCurrentUserId();
        if (!userId) return;

        const notifications = getNotifications();

        notifications.forEach(function (notification) {
            if (String(notification.userId) === String(userId)) {
                notification.read = true;
            }
        });

        if (saveNotifications(notifications)) {
            renderNotifications();
        }
    });
}

/* Clear current user's notifications */
if (clearNotificationsButton) {
    clearNotificationsButton.addEventListener("click", function (event) {
        event.stopPropagation();

        const userId = getCurrentUserId();

        if (!userId) {
            alert("Please log in to manage notifications.");
            return;
        }

        if (!confirm("Are you sure you want to clear your notifications?")) {
            return;
        }

        const remainingNotifications = getNotifications().filter(
            function (notification) {
                return String(notification.userId) !== String(userId);
            }
        );

        if (saveNotifications(remainingNotifications)) {
            renderNotifications();
        }
    });
}

/* Initial display */
renderNotifications();


});

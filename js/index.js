
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

    // Read notifications from localStorage
    function getNotifications() {
        try {
            const data = JSON.parse(
                localStorage.getItem(notificationStorageKey) || "[]"
            );

            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    // Save notifications to localStorage
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

    // Update unread count
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

    // Display notifications
    function renderNotifications() {
        if (!notificationList) return;

        const notifications = getNotifications();

        notificationList.replaceChildren();

        if (notifications.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "no-notifications";
            emptyMessage.textContent = "No notifications yet.";

            notificationList.appendChild(emptyMessage);
        } else {
            notifications.forEach(function (notification, index) {
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

                item.appendChild(message);
                item.appendChild(time);

                function markAsRead() {
                    const currentNotifications = getNotifications();

                    if (
                        currentNotifications[index] &&
                        !currentNotifications[index].read
                    ) {
                        currentNotifications[index].read = true;

                        if (saveNotifications(currentNotifications)) {
                            renderNotifications();
                        }
                    }
                }

                item.addEventListener("click", markAsRead);

                item.addEventListener("keydown", function (event) {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        markAsRead();
                    }
                });

                notificationList.appendChild(item);
            });
        }

        updateNotificationCount(notifications);
    }

    // Open and close dropdown
    if (notificationBell && notificationPanel) {
        notificationBell.addEventListener("click", function () {
            const isOpening = notificationPanel.hidden;

            notificationPanel.hidden = !isOpening;

            notificationBell.setAttribute(
                "aria-expanded",
                String(isOpening)
            );
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function (event) {
            if (
                !event.target.closest(".notification-wrapper") &&
                !notificationPanel.hidden
            ) {
                notificationPanel.hidden = true;
                notificationBell.setAttribute("aria-expanded", "false");
            }
        });

        // Close dropdown with Escape key
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                notificationPanel.hidden = true;
                notificationBell.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Mark all notifications as read
    if (markAllReadButton) {
        markAllReadButton.addEventListener("click", function () {
            const notifications = getNotifications();

            notifications.forEach(function (notification) {
                notification.read = true;
            });

            if (saveNotifications(notifications)) {
                renderNotifications();
            }
        });
    }

    // Clear all notifications
    if (clearNotificationsButton) {
        clearNotificationsButton.addEventListener("click", function () {
            const shouldClear = confirm(
                "Are you sure you want to clear all notifications?"
            );

            if (shouldClear && saveNotifications([])) {
                renderNotifications();
            }
        });
    }

    // Render notifications when the page loads
    renderNotifications();


});

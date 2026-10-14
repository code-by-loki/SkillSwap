
document.addEventListener("DOMContentLoaded", function () {

    // Storage keys used by SkillSwap.
    const usersKey = "skillswapDemoUsers";
    const sessionKey = "skillswapDemoSession";
    const profileKey = "skillswapDemoProfileDetailsByUser";
    const settingsKey = "skillswapUserSettings";

    // HTML elements.
    const accountForm = document.getElementById("accountForm");
    const displayName = document.getElementById("displayName");
    const email = document.getElementById("email");
    const bio = document.getElementById("bio");

    const requestNotifications =
        document.getElementById("requestNotifications");

    const sessionNotifications =
        document.getElementById("sessionNotifications");

    const themeSelect = document.getElementById("themeSelect");
    const logoutButton = document.getElementById("logoutButton");
    const pageMessage = document.getElementById("pageMessage");

    let currentUserId = sessionStorage.getItem(sessionKey);

    // Safely read JSON from localStorage.
    function readStorage(key, fallback) {
        try {
            const value = JSON.parse(
                localStorage.getItem(key) || "null"
            );

            return value === null ? fallback : value;

        } catch (error) {
            console.error("Storage read error:", key, error);
            return fallback;
        }
    }

    // Display a message to the user.
    function showMessage(message) {
        pageMessage.textContent = message;
    }

    // Get current user's profile.
    function getProfile() {
        const profiles = readStorage(profileKey, {});

        if (
            profiles &&
            typeof profiles === "object" &&
            !Array.isArray(profiles)
        ) {
            return profiles[currentUserId] || {};
        }

        return {};
    }

    // Load settings saved for the current user.
    function getUserSettings() {
        const allSettings = readStorage(settingsKey, {});

        if (
            !allSettings ||
            typeof allSettings !== "object" ||
            Array.isArray(allSettings)
        ) {
            return {};
        }

        return allSettings[currentUserId] || {};
    }

    // Apply selected theme.
    function applyTheme(theme) {
        const selectedTheme = theme === "light" ? "light" : "dark";

        document.body.classList.toggle(
            "light-theme",
            selectedTheme === "light"
        );

        themeSelect.value = selectedTheme;
    }

    // Save settings for the current user.
    function saveUserSettings(settings) {
        const allSettings = readStorage(settingsKey, {});

        if (
            !allSettings ||
            typeof allSettings !== "object" ||
            Array.isArray(allSettings)
        ) {
            throw new Error("Invalid settings data");
        }

        allSettings[currentUserId] = settings;

        localStorage.setItem(
            settingsKey,
            JSON.stringify(allSettings)
        );
    }

    // Load account information.
    function loadAccount() {
        const profile = getProfile();
        const users = readStorage(usersKey, []);

        const user = Array.isArray(users)
            ? users.find(function (item) {
                return String(item.id) === String(currentUserId);
            })
            : null;

        displayName.value =
            profile.name || (user && user.name) || "";

        email.value =
            profile.email || (user && user.email) || "";

        bio.value = profile.bio || "";
    }

    // Load preferences.
    function loadSettings() {
        const settings = getUserSettings();

        requestNotifications.checked =
            settings.requestNotifications !== false;

        sessionNotifications.checked =
            settings.sessionNotifications !== false;

        applyTheme(settings.theme || "dark");
    }

    // Save account form.
    accountForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = displayName.value.trim();
        const newEmail = email.value.trim().toLowerCase();
        const newBio = bio.value.trim();

        if (!name || !newEmail) {
            showMessage("Please enter your name and email.");
            return;
        }

        try {
            const users = readStorage(usersKey, []);

            if (!Array.isArray(users)) {
                throw new Error("Invalid user data");
            }

            const currentUser = users.find(function (user) {
                return String(user.id) === String(currentUserId);
            });

            if (!currentUser) {
                showMessage(
                    "Your demo account was not found. Please log in again."
                );
                return;
            }

            // Avoid using another user's email.
            const emailTaken = users.some(function (user) {
                return (
                    String(user.id) !== String(currentUserId) &&
                    String(user.email).toLowerCase() === newEmail
                );
            });

            if (emailTaken) {
                showMessage("This email is already used by another account.");
                return;
            }

            const profiles = readStorage(profileKey, {});

            if (
                !profiles ||
                typeof profiles !== "object" ||
                Array.isArray(profiles)
            ) {
                throw new Error("Invalid profile data");
            }

            const oldProfile = profiles[currentUserId] || {};

            // Keep existing skill information.
            profiles[currentUserId] = {
                ...oldProfile,
                name: name,
                email: newEmail,
                bio: newBio
            };

            // Update the demo account's name and email.
            currentUser.name = name;
            currentUser.email = newEmail;

            localStorage.setItem(
                profileKey,
                JSON.stringify(profiles)
            );

            localStorage.setItem(
                usersKey,
                JSON.stringify(users)
            );

            showMessage("Account settings saved successfully!");

        } catch (error) {
            console.error("Could not save account:", error);
            showMessage("Could not save your account settings.");
        }
    });

    // Save notification preferences and theme.
    function savePreferences() {
        try {
            saveUserSettings({
                requestNotifications: requestNotifications.checked,
                sessionNotifications: sessionNotifications.checked,
                theme: themeSelect.value
            });

            applyTheme(themeSelect.value);
            showMessage("Your preferences have been saved.");

        } catch (error) {
            console.error("Could not save preferences:", error);
            showMessage("Could not save your preferences.");
        }
    }

    requestNotifications.addEventListener(
        "change",
        savePreferences
    );

    sessionNotifications.addEventListener(
        "change",
        savePreferences
    );

    themeSelect.addEventListener("change", savePreferences);

    // Log out the current user.
    logoutButton.addEventListener("click", function () {
        const confirmLogout = confirm(
            "Are you sure you want to log out?"
        );

        if (!confirmLogout) {
            return;
        }

        sessionStorage.removeItem(sessionKey);

        window.location.href = "login.html";
    });

    // Initialize page.
    if (!currentUserId) {
        accountForm.querySelectorAll("input, textarea, button").forEach(
            function (element) {
                element.disabled = true;
            }
        );

        requestNotifications.disabled = true;
        sessionNotifications.disabled = true;
        themeSelect.disabled = true;
        logoutButton.disabled = true;

        showMessage("Please log in to manage your settings.");

        return;
    }

    loadAccount();
    loadSettings();

});

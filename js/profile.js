
document.addEventListener("DOMContentLoaded", function () {
    const USERS_KEY = "skillswapDemoUsers";
    const SESSION_KEY = "skillswapDemoSession";
    const DETAILS_KEY = "skillswapDemoProfileDetailsByUser";

    // 1. Check the logged-in user
    const loggedInUserId = sessionStorage.getItem(SESSION_KEY);
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    if (!loggedInUserId) {
        alert("Please login first to access your profile.");
        window.location.replace("login.html");
        return;
    }

    const currentUser = users.find(function (user) {
        return user.id === loggedInUserId;
    });

    if (!currentUser) {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace("login.html");
        return;
    }

    // 2. Get this user's saved profile only
    let allDetails = {};

    try {
        allDetails =
            JSON.parse(localStorage.getItem(DETAILS_KEY)) || {};
    } catch (error) {
        allDetails = {};
    }

    let details = allDetails[loggedInUserId] || {
        name: currentUser.name,
        email: currentUser.email,
        bio: "",
        teachSkills: ["Java", "HTML"],
        learnSkills: ["UI/UX Design", "Photography"]
    };

    // 3. Get HTML elements
    const editButton = document.getElementById("editButton");
    const cancelButton = document.getElementById("cancelButton");
    const editSection = document.getElementById("editProfileSection");
    const profileForm = document.getElementById("profileForm");
    const message = document.getElementById("profileMessage");
    const logoutButton = document.getElementById("logoutButton");

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const bioInput = document.getElementById("bioInput");
    const teachInput = document.getElementById("teachInput");
    const learnInput = document.getElementById("learnInput");

    // 4. Display profile
    function loadProfile() {
        document.getElementById("displayName").textContent =
            details.name;

        document.getElementById("displayEmail").textContent =
            details.email;

        document.getElementById("displayBio").textContent =
            details.bio || "No bio added yet.";

        document.getElementById("avatar").textContent =
            details.name.charAt(0).toUpperCase();

        renderSkills("teachSkills", details.teachSkills);
        renderSkills("learnSkills", details.learnSkills);
    }

    // 5. Display skill tags safely
    function renderSkills(elementId, skills) {
        const container = document.getElementById(elementId);

        if (!container) return;

        container.replaceChildren();

        skills.forEach(function (skill) {
            const tag = document.createElement("span");
            tag.textContent = skill;
            container.appendChild(tag);
        });
    }

    // 6. Convert comma-separated skills into an array
    function getSkills(value) {
        return value
            .split(",")
            .map(function (skill) {
                return skill.trim();
            })
            .filter(function (skill) {
                return skill.length > 0;
            })
            .slice(0, 20);
    }

    // 7. Open editor
    function openEditor() {
        nameInput.value = details.name;
        emailInput.value = details.email;
        bioInput.value = details.bio || "";

        teachInput.value = details.teachSkills.join(", ");
        learnInput.value = details.learnSkills.join(", ");

        message.textContent = "";
        editSection.hidden = false;

        editSection.scrollIntoView({ behavior: "smooth" });
    }

    if (editButton) {
        editButton.addEventListener("click", openEditor);
    }

    // 8. Cancel editing
    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            editSection.hidden = true;
            message.textContent = "";
        });
    }

    // 9. Save profile changes
    if (profileForm) {
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim().toLowerCase();
            const bio = bioInput.value.trim();

            if (!name || !email) {
                message.textContent = "Name and email are required.";
                message.style.color = "#ff7777";
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                message.textContent = "Please enter a valid email address.";
                message.style.color = "#ff7777";
                return;
            }

            // Prevent duplicate email addresses
            const emailExists = users.some(function (user) {
                return user.id !== loggedInUserId &&
                    user.email.toLowerCase() === email;
            });

            if (emailExists) {
                message.textContent =
                    "This email is already used by another account.";
                message.style.color = "#ff7777";
                return;
            }

            const updatedDetails = {
                name: name,
                email: email,
                bio: bio || "No bio added yet.",
                teachSkills: getSkills(teachInput.value),
                learnSkills: getSkills(learnInput.value)
            };

            try {
                // Save under this user's ID
                allDetails[loggedInUserId] = updatedDetails;

                localStorage.setItem(
                    DETAILS_KEY,
                    JSON.stringify(allDetails)
                );

                // Update the correct account
                currentUser.name = name;
                currentUser.email = email;

                localStorage.setItem(
                    USERS_KEY,
                    JSON.stringify(users)
                );

                details = updatedDetails;
                loadProfile();

                message.textContent = "Profile updated successfully!";
                message.style.color = "#72e6a5";
                editSection.hidden = true;

            } catch (error) {
                message.textContent =
                    "Unable to save changes. Browser storage may be unavailable.";
                message.style.color = "#ff7777";
            }
        });
    }

    // 10. Logout
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            sessionStorage.removeItem(SESSION_KEY);
            window.location.href = "login.html";
        });
    }

    // 11. Display profile when page opens
    loadProfile();
});

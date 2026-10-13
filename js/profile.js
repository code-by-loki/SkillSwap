document.addEventListener("DOMContentLoaded", function () {

   
    // Check login session and registered profile
    const loggedInUser = sessionStorage.getItem("skillswapDemoSession");
    const savedProfile = localStorage.getItem("skillswapDemoProfile");

    if (!loggedInUser || !savedProfile) {
        alert("Please login first to access your profile.");
        window.location.replace("login.html");
        return;
    }

    const profile = JSON.parse(savedProfile);

    if (profile.email !== loggedInUser) {
        sessionStorage.removeItem("skillswapDemoSession");
        window.location.replace("login.html");
        return;
    }

    const editButton = document.getElementById("editButton");
    const cancelButton = document.getElementById("cancelButton");
    const editSection = document.getElementById("editProfileSection");
    const profileForm = document.getElementById("profileForm");
    const message = document.getElementById("profileMessage");
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        sessionStorage.removeItem("skillswapDemoSession");
        window.location.href = "login.html";
    });
    }

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const bioInput = document.getElementById("bioInput");
    const teachInput = document.getElementById("teachInput");
    const learnInput = document.getElementById("learnInput");

    const PROFILE_KEY = "skillswapDemoProfile";
    const DETAILS_KEY = "skillswapDemoProfileDetails";

    // Load saved profile details
    function loadProfile() {
        try {
            const savedDetails = localStorage.getItem(DETAILS_KEY);
            const savedAccount = localStorage.getItem(PROFILE_KEY);

            const details = savedDetails ? JSON.parse(savedDetails) : {};
            const account = savedAccount ? JSON.parse(savedAccount) : {};

            const name = details.name || account.name || "Loki Kumar";
            const email = details.email || account.email || "loki@example.com";
            const bio = details.bio || "Learning new skills and sharing knowledge with others.";

            document.getElementById("displayName").textContent = name;
            document.getElementById("displayEmail").textContent = email;
            document.getElementById("displayBio").textContent = bio;
            document.getElementById("avatar").textContent =
                name.charAt(0).toUpperCase();

            renderSkills(
                "teachSkills",
                details.teachSkills || ["Java", "HTML"]
            );

            renderSkills(
                "learnSkills",
                details.learnSkills || ["UI/UX Design", "Photography"]
            );

        } catch (error) {
            console.error("Unable to load profile details.", error);
        }
    }

    // Display skill tags
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

    // Convert comma-separated text into an array
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

    // Open the edit form with current details
    function openEditor() {
        nameInput.value =
            document.getElementById("displayName").textContent;

        emailInput.value =
            document.getElementById("displayEmail").textContent;

        bioInput.value =
            document.getElementById("displayBio").textContent;

        teachInput.value =
            Array.from(document.querySelectorAll("#teachSkills span"))
                .map(function (tag) {
                    return tag.textContent;
                }).join(", ");

        learnInput.value =
            Array.from(document.querySelectorAll("#learnSkills span"))
                .map(function (tag) {
                    return tag.textContent;
                }).join(", ");

        message.textContent = "";
        editSection.hidden = false;
        editSection.scrollIntoView({ behavior: "smooth" });
    }

    editButton.addEventListener("click", openEditor);

    // Cancel editing
    cancelButton.addEventListener("click", function () {
        editSection.hidden = true;
        message.textContent = "";
    });

    // Save profile changes
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
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

        const profileDetails = {
            name: name,
            email: email,
            bio: bio || "No bio added yet.",
            teachSkills: getSkills(teachInput.value),
            learnSkills: getSkills(learnInput.value)
        };

        try {
            localStorage.setItem(
                DETAILS_KEY,
                JSON.stringify(profileDetails)
            );

            // Keep the demo profile name/email in sync with registration data.
            const savedAccount = localStorage.getItem(PROFILE_KEY);

            if (savedAccount) {
                const account = JSON.parse(savedAccount);
                account.name = name;
                account.email = email;

                localStorage.setItem(
                    PROFILE_KEY,
                    JSON.stringify(account)
                );
            }

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

    // Display profile when the page opens
    loadProfile();

});

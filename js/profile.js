
document.addEventListener("DOMContentLoaded", function () {

    const editButton = document.getElementById("editButton");
    const cancelButton = document.getElementById("cancelButton");
    const editSection = document.getElementById("editProfileSection");
    const profileForm = document.getElementById("profileForm");
    const message = document.getElementById("profileMessage");

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const bioInput = document.getElementById("bioInput");
    const teachInput = document.getElementById("teachInput");
    const learnInput = document.getElementById("learnInput");

    function renderSkills(elementId, skills) {
        const container = document.getElementById(elementId);
        container.replaceChildren();

        skills.forEach(function (skill) {
            const tag = document.createElement("span");
            tag.textContent = skill;
            container.appendChild(tag);
        });
    }

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

    cancelButton.addEventListener("click", function () {
        editSection.hidden = true;
        message.textContent = "";
    });

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const bio = bioInput.value.trim();

        if (!name || !email) {
            message.textContent = "Name and email are required.";
            return;
        }

        document.getElementById("displayName").textContent = name;
        document.getElementById("displayEmail").textContent = email;
        document.getElementById("displayBio").textContent =
            bio || "No bio added yet.";

        document.getElementById("avatar").textContent =
            name.charAt(0).toUpperCase();

        renderSkills("teachSkills", getSkills(teachInput.value));
        renderSkills("learnSkills", getSkills(learnInput.value));

        message.textContent = "Profile updated for this page!";
        editSection.hidden = true;
    });

});

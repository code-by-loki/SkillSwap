document.addEventListener("DOMContentLoaded", function () {
    const savedSkillsList = document.getElementById("savedSkillsList");
    const emptySavedState = document.getElementById("emptySavedState");
    const savedCount = document.getElementById("savedCount");
    const savedMessage = document.getElementById("savedMessage");

    const storageKey = "skillswapSavedSkills";
    const sessionKey = "skillswapDemoSession";

    function getSavedSkills() {
        const userId = sessionStorage.getItem(sessionKey);

        if (!userId) {
            window.location.replace("login.html");
            return [];
        }

        try {
            const data = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            if (!Array.isArray(data)) {
                return [];
            }

            return data.filter(function (item) {
                return item &&
                    String(item.userId) === String(userId);
            });
        } catch (error) {
            savedMessage.textContent =
                "Unable to read saved skills from browser storage.";

            return [];
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

    function renderSavedSkills() {
        const skills = getSavedSkills();

        savedSkillsList.replaceChildren();

        savedCount.textContent =
            skills.length + (skills.length === 1
                ? " saved skill"
                : " saved skills");

        emptySavedState.hidden = skills.length > 0;

        skills.forEach(function (skill, index) {
            const skillName =
                typeof skill === "string"
                    ? skill
                    : skill.name || skill.title || "Saved Skill";

            const description =
                typeof skill === "object" && skill !== null
                    ? skill.description || "A skill saved to your collection."
                    : "A skill saved to your collection.";

            const card = createElement("article", "saved-skill-card");

            const icon = createElement(
                "div",
                "saved-skill-icon",
                "✦"
            );

            const title = createElement("h3", "", skillName);
            const details = createElement("p", "", description);

            const actions = createElement("div", "saved-skill-actions");

            const viewLink = document.createElement("a");
            viewLink.className = "view-skill-link";
            viewLink.textContent = "Explore";
            viewLink.href =
            typeof skill === "object" && skill !== null && skill.link
            ? skill.link
              : "explore.html";

            const removeButton = createElement(
                "button",
                "remove-saved-button",
                "Remove"
            );

            removeButton.type = "button";

            
removeButton.addEventListener("click", function () {
    const userId = sessionStorage.getItem("skillswapDemoSession");

    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    try {
        const allSkills = JSON.parse(
            localStorage.getItem(storageKey) || "[]"
        );

        if (!Array.isArray(allSkills)) {
            throw new Error("Invalid saved skills data");
        }

        const currentSkill = skills[index];
        const skillNameToRemove =
            typeof currentSkill === "string"
                ? currentSkill
                : currentSkill.name || currentSkill.title;

        const updatedSkills = allSkills.filter(function (item) {
            if (!item || String(item.userId) !== String(userId)) {
                return true;
            }

            const itemName =
                typeof item === "string"
                    ? item
                    : item.name || item.title;

            return itemName !== skillNameToRemove;
        });

        localStorage.setItem(
            storageKey,
            JSON.stringify(updatedSkills)
        );

        savedMessage.textContent =
            skillNameToRemove + " removed from saved skills.";

        renderSavedSkills();
    } catch (error) {
        console.error("Could not remove saved skill:", error);

        savedMessage.textContent =
            "Could not remove this skill. Please try again.";
    }
});

            actions.append(viewLink, removeButton);
            card.append(icon, title, details, actions);
            savedSkillsList.append(card);
        });
    }

    renderSavedSkills();
});
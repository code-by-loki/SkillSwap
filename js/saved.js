document.addEventListener("DOMContentLoaded", function () {
    const savedSkillsList = document.getElementById("savedSkillsList");
    const emptySavedState = document.getElementById("emptySavedState");
    const savedCount = document.getElementById("savedCount");
    const savedMessage = document.getElementById("savedMessage");

    const storageKey = "skillswapSavedSkills";

    function getSavedSkills() {
        try {
            const data = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            return Array.isArray(data) ? data : [];
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
                const currentSkills = getSavedSkills();

                currentSkills.splice(index, 1);

                try {
                    localStorage.setItem(
                        storageKey,
                        JSON.stringify(currentSkills)
                    );

                    savedMessage.textContent =
                        skillName + " removed from saved skills.";

                    renderSavedSkills();
                } catch (error) {
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
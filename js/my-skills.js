
document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "skillswapMySkills";

    const teachForm = document.getElementById("teachForm");
    const learnForm = document.getElementById("learnForm");

    const teachInput = document.getElementById("teachSkillInput");
    const learnInput = document.getElementById("learnSkillInput");

    const teachLevel = document.getElementById("teachLevel");
    const learnLevel = document.getElementById("learnLevel");

    const teachList = document.getElementById("teachSkillList");
    const learnList = document.getElementById("learnSkillList");

    const teachCount = document.getElementById("teachCount");
    const learnCount = document.getElementById("learnCount");

    const teachEmpty = document.getElementById("teachEmpty");
    const learnEmpty = document.getElementById("learnEmpty");

    const message = document.getElementById("skillsMessage");

    let editing = null;

    function loadSkills() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

            if (saved && Array.isArray(saved.teach) &&
                Array.isArray(saved.learn)) {
                return saved;
            }
        } catch (error) {
            console.warn("Could not load saved skills.", error);
        }

        return { teach: [], learn: [] };
    }

    let skills = loadSkills();

    function saveSkills() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
            return true;
        } catch (error) {
            showMessage("Unable to save. Check your browser storage.");
            return false;
        }
    }

    function showMessage(text) {
        message.textContent = text;
    }

    function openForm(type) {
        editing = null;

        const form = type === "teach" ? teachForm : learnForm;
        const input = type === "teach" ? teachInput : learnInput;

        teachForm.hidden = type !== "teach";
        learnForm.hidden = type !== "learn";

        form.reset();
        input.focus();
        showMessage("");
    }

    document.getElementById("addTeachBtn").addEventListener("click", function () {
        openForm("teach");
    });

    document.getElementById("addLearnBtn").addEventListener("click", function () {
        openForm("learn");
    });

    document.getElementById("cancelTeachBtn").addEventListener("click", function () {
        teachForm.reset();
        teachForm.hidden = true;
        editing = null;
        showMessage("");
    });

    document.getElementById("cancelLearnBtn").addEventListener("click", function () {
        learnForm.reset();
        learnForm.hidden = true;
        editing = null;
        showMessage("");
    });

    function renderList(type) {
        const list = type === "teach" ? teachList : learnList;
        const empty = type === "teach" ? teachEmpty : learnEmpty;
        const count = type === "teach" ? teachCount : learnCount;

        list.replaceChildren();

        const items = skills[type];
        count.textContent = items.length;
        empty.hidden = items.length > 0;

        items.forEach(function (skill, index) {
            const card = document.createElement("article");
            card.className = "skill-item";

            const title = document.createElement("h3");
            title.textContent = skill.name;

            const level = document.createElement("span");
            level.className = "skill-level";
            level.textContent = skill.level;

            const actions = document.createElement("div");
            actions.className = "skill-item-actions";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "skill-action";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function () {
                openForm(type);

                const form = type === "teach" ? teachForm : learnForm;
                const input = type === "teach" ? teachInput : learnInput;
                const select = type === "teach" ? teachLevel : learnLevel;

                editing = { type: type, index: index };
                input.value = skill.name;
                select.value = skill.level;
                form.hidden = false;
                input.focus();
                showMessage("Editing " + skill.name);
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "skill-action delete";
            deleteButton.textContent = "Remove";

            deleteButton.addEventListener("click", function () {
                const confirmed = window.confirm(
                    "Remove " + skill.name + " from your skills?"
                );

                if (!confirmed) return;

                const removed = skills[type].splice(index, 1);

                if (!saveSkills()) {
                    skills[type].splice(index, 0, removed[0]);
                    renderAll();
                    return;
                }

                renderAll();
                showMessage(skill.name + " removed successfully.");
            });

            actions.append(editButton, deleteButton);
            card.append(title, level, actions);
            list.appendChild(card);
        });
    }

    function renderAll() {
        renderList("teach");
        renderList("learn");
    }

    function handleSubmit(type, event) {
        event.preventDefault();

        const input = type === "teach" ? teachInput : learnInput;
        const select = type === "teach" ? teachLevel : learnLevel;
        const form = type === "teach" ? teachForm : learnForm;
        const name = input.value.trim();

        if (!name) {
            showMessage("Please enter a skill name.");
            input.focus();
            return;
        }

        const duplicate = skills[type].some(function (skill, index) {
            const sameName = skill.name.toLowerCase() === name.toLowerCase();
            const isCurrentSkill = editing &&
                editing.type === type &&
                editing.index === index;

            return sameName && !isCurrentSkill;
        });

        if (duplicate) {
            showMessage("That skill is already in your list.");
            input.focus();
            return;
        }

        let previousSkill = null;
        let newSkill = { name: name, level: select.value };
        let index = -1;

        if (editing && editing.type === type) {
            index = editing.index;
            previousSkill = skills[type][index];
            skills[type][index] = newSkill;
        } else {
            skills[type].push(newSkill);
            index = skills[type].length - 1;
        }

        if (!saveSkills()) {
            if (previousSkill) {
                skills[type][index] = previousSkill;
            } else {
                skills[type].splice(index, 1);
            }
            renderAll();
            return;
        }

        form.reset();
        form.hidden = true;
        editing = null;

        renderAll();
        showMessage(name + " saved successfully.");
    }

    teachForm.addEventListener("submit", function (event) {
        handleSubmit("teach", event);
    });

    learnForm.addEventListener("submit", function (event) {
        handleSubmit("learn", event);
    });

    renderAll();
});

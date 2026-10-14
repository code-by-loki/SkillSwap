document.addEventListener("DOMContentLoaded", function () {

    // 1. Get HTML elements
    const searchInput = document.getElementById("skillSearch");
    const searchButton = document.getElementById("searchButton");
    const clearSearchButton = document.getElementById("clearSearchButton");

    
    const categoryButtons = document.querySelectorAll(".category-btn");
    const skillsGrid = document.getElementById("skillsGrid");

let skillCards = Array.from(
    document.querySelectorAll(".explore-card")
);

    
    // Registered users' teach skills
    const USERS_KEY = "skillswapDemoUsers";
    const DETAILS_KEY = "skillswapDemoProfileDetailsByUser";

    function renderRegisteredUsers() {
        let users = [];
        let allDetails = {};

        try {
            users = JSON.parse(
                localStorage.getItem(USERS_KEY) || "[]"
            );

            allDetails = JSON.parse(
                localStorage.getItem(DETAILS_KEY) || "{}"
            );
        } catch (error) {
            console.error("Unable to load registered users:", error);
        }

        if (!Array.isArray(users) || !skillsGrid) return;

        // Remove only previously generated member cards.
        skillsGrid.querySelectorAll(".registered-user-card")
            .forEach(card => card.remove());

        const currentUserId =
            sessionStorage.getItem("skillswapDemoSession");

        users.forEach(function (user) {
            const details = allDetails[user.id] || {};

            const teachSkills = Array.isArray(details.teachSkills)
                ? details.teachSkills
                : [];

            // Don't list members who haven't selected teach skills.
            teachSkills.forEach(function (skill) {
                if (!skill || !skill.trim()) return;

                const category = getCategory(skill);
                const card = document.createElement("article");

                card.className = "explore-card registered-user-card";
                card.dataset.category = category;
                card.dataset.memberId = user.id;

                const icon = document.createElement("div");
                icon.className = "explore-icon";
                icon.textContent = getSkillIcon(category);

                const categoryLabel = document.createElement("p");
                categoryLabel.className = "skill-category";
                categoryLabel.textContent = category.toUpperCase();

                const titleRow = document.createElement("div");
                titleRow.className = "skill-title-row";

                const title = document.createElement("h3");
                title.textContent = skill;

                titleRow.appendChild(title);

                const description = document.createElement("p");
                description.textContent =
                    "Learn " + skill + " from a SkillSwap member.";

                const teacher = document.createElement("div");
                teacher.className = "skill-teacher";

                const avatar = document.createElement("span");
                avatar.className = "teacher-avatar";
                avatar.textContent =
                    (details.name || user.name || "?")
                    .charAt(0).toUpperCase();

                const teacherInfo = document.createElement("div");
                const teacherName = document.createElement("h4");
                teacherName.textContent =
                    details.name || user.name || "SkillSwap Member";

                const teacherLabel = document.createElement("p");
                teacherLabel.textContent = "Registered Member";

                teacherInfo.append(teacherName, teacherLabel);
                teacher.append(avatar, teacherInfo);

                card.append(
                    icon,
                    categoryLabel,
                    titleRow,
                    description,
                    teacher
                );

                // Link to the member's profile.
                const profileLink = document.createElement("a");
                profileLink.className = "view-skill-link";
                profileLink.href =
                    "user-profile.html?userId=" +
                    encodeURIComponent(user.id);
                profileLink.textContent = "View Member →";

                card.appendChild(profileLink);

                // Don't show the currently logged-in user in results.
                if (user.id !== currentUserId) {
                    skillsGrid.appendChild(card);
                }
            });
        });

        // Include dynamically added member cards in search/sort.
        skillCards = Array.from(
            skillsGrid.querySelectorAll(".explore-card")
        );
    }

    function getCategory(skill) {
        const name = skill.toLowerCase();

        if (/java|python|programming|javascript|html|css|web development|coding/.test(name)) {
            return "Programming";
        }

        if (/ui.?ux|design|figma|graphic/.test(name)) {
            return "Design";
        }

        if (/english|tamil|language|speaking|communication/.test(name)) {
            return "Languages";
        }

        if (/photography|camera|photo/.test(name)) {
            return "Photography";
        }

        if (/guitar|music|singing|piano/.test(name)) {
            return "Music";
        }

        return "All";
    }

    function getSkillIcon(category) {
        const icons = {
            Programming: "💻",
            Design: "🎨",
            Languages: "🗣️",
            Photography: "📸",
            Music: "🎸",
            All: "✨"
        };

        return icons[category] || icons.All;
    }

    renderRegisteredUsers();

    const noResults = document.getElementById("noResults");
    const resultsCount = document.getElementById("resultsCount");
    const sortSkills = document.getElementById("sortSkills");
    

    // 2. Read category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestedCategory = urlParams.get("category");

    const validCategories = [
        "Programming",
        "Design",
        "Languages",
        "Photography",
        "Music"
    ];

    let selectedCategory = validCategories.includes(requestedCategory)
        ? requestedCategory
        : "All";

    // 3. Set active category on page load
    categoryButtons.forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.category === selectedCategory
        );
    });

    // 4. Filter and sort skills
    function filterSkills() {

        const searchText = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        let visibleCount = 0;

        // Filter cards using search and category
        skillCards.forEach(function (card) {

            const titleElement = card.querySelector("h3");

            const skillName = titleElement
                ? titleElement.textContent.toLowerCase()
                : "";

            const cardText = card.textContent.toLowerCase();
            const cardCategory = card.dataset.category;

            const matchesSearch =
                cardText.includes(searchText);

            const matchesCategory =
                selectedCategory === "All" ||
                cardCategory === selectedCategory;

            const isVisible = matchesSearch && matchesCategory;

            card.style.display = isVisible ? "" : "none";

            if (isVisible) {
                visibleCount++;
            }
        });

        // 5. Show or hide no-results message
        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }

        // 6. Update results count
        if (resultsCount) {
            resultsCount.textContent =
                "Showing " + visibleCount +
                " of " + skillCards.length + " skills";
        }

        // 7. Sort cards alphabetically
        if (skillsGrid && sortSkills) {

            const sortedCards = [...skillCards];

            if (sortSkills.value === "name-asc") {

                sortedCards.sort(function (a, b) {
                    const nameA = a.querySelector("h3").textContent.trim();
                    const nameB = b.querySelector("h3").textContent.trim();

                    return nameA.localeCompare(nameB);
                });

            } else if (sortSkills.value === "name-desc") {

                sortedCards.sort(function (a, b) {
                    const nameA = a.querySelector("h3").textContent.trim();
                    const nameB = b.querySelector("h3").textContent.trim();

                    return nameB.localeCompare(nameA);
                });
            }

            // Reorder existing cards without recreating them.
            // This preserves their Save button event listeners.
            sortedCards.forEach(function (card) {
                skillsGrid.appendChild(card);
            });
        }
    }

    // 8. Search button
    if (searchButton) {
        searchButton.addEventListener("click", filterSkills);
    }

    // 9. Live search
    if (searchInput) {

        searchInput.addEventListener("input", filterSkills);

        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                filterSkills();
            }
        });
    }

    // 10. Category filtering
    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedCategory = button.dataset.category;

            categoryButtons.forEach(function (categoryButton) {
                categoryButton.classList.toggle(
                    "active",
                    categoryButton === button
                );
            });

            filterSkills();
        });
    });

    // 11. Clear search and reset filters
    if (clearSearchButton) {

        clearSearchButton.addEventListener("click", function () {

            if (searchInput) {
                searchInput.value = "";
            }

            selectedCategory = "All";

            categoryButtons.forEach(function (button) {
                button.classList.toggle(
                    "active",
                    button.dataset.category === "All"
                );
            });

            if (sortSkills) {
                sortSkills.value = "default";
            }

            filterSkills();
        });
    }

    // 12. Sort selection
    if (sortSkills) {
        sortSkills.addEventListener("change", filterSkills);
    }

    // 13. Saved Skills feature
    const saveButtons = document.querySelectorAll(".save-skill-btn");
    const savedStorageKey = "skillswapSavedSkills";

    function getSavedSkills() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(savedStorageKey) || "[]"
            );

            return Array.isArray(saved) ? saved : [];

        } catch (error) {
            console.error("Could not read saved skills:", error);
            return [];
        }
    }

    function updateSaveButton(button, isSaved) {
        button.classList.toggle("is-saved", isSaved);
        button.textContent = isSaved ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(isSaved));

        button.title = isSaved
            ? "Remove saved skill"
            : "Save skill";
    }

    function getCardSkill(card) {

        const title = card.querySelector(".skill-title-row h3");
        const link = card.querySelector(".view-skill-link");
        const description = card.querySelector(
            ":scope > p:not(.skill-category)"
        );

        return {
            name: title ? title.textContent.trim() : "Skill",
            description: description
                ? description.textContent.trim()
                : "",
            category: card.dataset.category || "",
            link: link
                ? link.getAttribute("href")
                : "explore.html"
        };
    }

    // 14. Restore saved heart states
    const initialSavedSkills = getSavedSkills();

    saveButtons.forEach(function (button) {

        const card = button.closest(".explore-card");

        if (!card) {
            return;
        }

        const skill = getCardSkill(card);

        const isSaved = initialSavedSkills.some(function (saved) {
            return saved && saved.name === skill.name;
        });

        updateSaveButton(button, isSaved);

        // 15. Save or remove a skill
        button.addEventListener("click", function () {

            const savedSkills = getSavedSkills();

            const existingIndex = savedSkills.findIndex(function (saved) {
                return saved && saved.name === skill.name;
            });

            if (existingIndex !== -1) {
                savedSkills.splice(existingIndex, 1);
            } else {
                savedSkills.push(skill);
            }

            try {

                localStorage.setItem(
                    savedStorageKey,
                    JSON.stringify(savedSkills)
                );

                updateSaveButton(button, existingIndex === -1);

            } catch (error) {

                console.error("Could not save skill:", error);

                alert(
                    "Could not save this skill. Check browser storage."
                );
            }
        });
    });

    // 16. Apply initial category and display results
    filterSkills();

});

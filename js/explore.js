
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. HTML ELEMENTS
    // ==========================================

    const searchInput = document.getElementById("skillSearch");
    const searchButton = document.getElementById("searchButton");
    const clearSearchButton = document.getElementById("clearSearchButton");

    const categoryButtons = document.querySelectorAll(".category-btn");
    const skillsGrid = document.getElementById("skillsGrid");
    const noResults = document.getElementById("noResults");
    const resultsCount = document.getElementById("resultsCount");
    const sortSkills = document.getElementById("sortSkills");

    const USERS_KEY = "skillswapDemoUsers";
    const DETAILS_KEY = "skillswapDemoProfileDetailsByUser";
    const SESSION_KEY = "skillswapDemoSession";
    const SAVED_KEY = "skillswapSavedSkills";

    // ==========================================
    // 2. STORAGE HELPERS
    // ==========================================

    function readArray(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.error("Unable to read:", key, error);
            return [];
        }
    }

    function readObject(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "{}");

            return value &&
                typeof value === "object" &&
                !Array.isArray(value)
                ? value
                : {};
        } catch (error) {
            console.error("Unable to read:", key, error);
            return {};
        }
    }

    function normalize(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }

    // ==========================================
    // 3. SKILL CATEGORY AND ICON
    // ==========================================

    function getCategory(skill) {
        const name = normalize(skill);

        if (/java|python|programming|javascript|html|css|web development|coding|software/.test(name)) {
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

    // ==========================================
    // 4. SKILL ALIASES
    // Similar skill names use one common card.
    // ==========================================

    const skillAliases = {
        "java": "java programming",
        "core java": "java programming",
        "java programming": "java programming",

        "web development": "web development",
        "web development basics": "web development",

        "ui ux": "ui/ux design",
        "ui/ux": "ui/ux design",
        "ui ux design": "ui/ux design",
        "ui/ux design": "ui/ux design",

        "spoken english": "english speaking",
        "english": "english speaking",
        "english speaking": "english speaking",

        "photography": "photography basics",
        "photography basics": "photography basics",

        "guitar": "guitar basics",
        "guitar basics": "guitar basics"
    };

    function canonicalSkill(skill) {
        const name = normalize(skill);
        return skillAliases[name] || name;
    }

    function getSkillDescription(skill) {
        const descriptions = {
            "java programming":
                "Learn Java fundamentals, OOP concepts, and problem-solving.",

            "web development":
                "Learn HTML, CSS, and JavaScript to build websites.",

            "ui/ux design":
                "Explore user interface design, wireframes, and prototypes.",

            "english speaking":
                "Practice everyday English, pronunciation, and conversations.",

            "photography basics":
                "Learn composition, lighting, and camera fundamentals.",

            "guitar basics":
                "Learn beginner chords, rhythm, and simple songs."
        };

        return descriptions[canonicalSkill(skill)] ||
            "Learn " + skill + " from a registered SkillSwap member.";
    }

    function getDetailsLink(skill) {
        const links = {
            "java programming": "java",
            "web development": "webdev",
            "ui/ux design": "uiux",
            "english speaking": "english",
            "photography basics": "photography",
            "guitar basics": "guitar"
        };

        const key = links[canonicalSkill(skill)];

        return key
            ? "skill-details.html?skill=" + encodeURIComponent(key)
            : "skill-details.html?skill=" + encodeURIComponent(skill);
    }

    // ==========================================
    // 5. SAVED SKILLS
    // ==========================================

    function getSavedSkills() {
        return readArray(SAVED_KEY);
    }

    function updateSaveButton(button, isSaved) {
        button.classList.toggle("is-saved", isSaved);
        button.textContent = isSaved ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(isSaved));

        button.title = isSaved
            ? "Remove saved skill"
            : "Save skill";
    }

    function createSaveButton(skillName) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "save-skill-btn";
        button.setAttribute("aria-label", "Save " + skillName);
        button.setAttribute("aria-pressed", "false");
        button.title = "Save skill";
        button.textContent = "♡";

        const saved = getSavedSkills().some(function (item) {
            return item && canonicalSkill(item.name) === canonicalSkill(skillName);
        });

        updateSaveButton(button, saved);

        button.addEventListener("click", function () {
            const savedSkills = getSavedSkills();

            const index = savedSkills.findIndex(function (item) {
                return item &&
                    canonicalSkill(item.name) === canonicalSkill(skillName);
            });

            if (index !== -1) {
                savedSkills.splice(index, 1);
            } else {
                savedSkills.push({
                    name: skillName,
                    description: getSkillDescription(skillName),
                    category: getCategory(skillName),
                    link: getDetailsLink(skillName)
                });
            }

            try {
                localStorage.setItem(SAVED_KEY, JSON.stringify(savedSkills));
                updateSaveButton(button, index === -1);
            } catch (error) {
                console.error("Could not save skill:", error);
                alert("Could not save this skill. Check browser storage.");
            }
        });

        return button;
    }


    // ==========================================
    // 7. RENDER REAL REGISTERED USERS
    // ==========================================

    function renderRegisteredUsers() {
        if (!skillsGrid) {
            return;
        }

        // Keep the six general skill discovery cards.
        // Remove cards generated by the previous render.
        skillsGrid.querySelectorAll(".registered-user-card").forEach(function (card) {
            card.remove();
        });

        const users = readArray(USERS_KEY);
        const allDetails = readObject(DETAILS_KEY);
        const currentUserId = sessionStorage.getItem(SESSION_KEY);

        // Avoid duplicate cards for the same member + same skill.
        const seen = new Set();

        users.forEach(function (user) {
            if (!user || user.id == null) {
                return;
            }

            // Don't show the logged-in user as a teacher to themselves.
            if (
                currentUserId &&
                String(user.id) === String(currentUserId)
            ) {
                return;
            }

            const details = allDetails[user.id] || {};
            const teachSkills = getTeachSkills(details);

            teachSkills.forEach(function (enteredSkill) {
                const skillName = String(enteredSkill || "").trim();

                if (!skillName) {
                    return;
                }

                const canonical = canonicalSkill(skillName);

                if (!canonical) {
                    return;
                }

                const uniqueKey = String(user.id) + "::" + canonical;

                if (seen.has(uniqueKey)) {
                    return;
                }

                seen.add(uniqueKey);

                const card = createMemberSkillCard(skillName, user, details);
                skillsGrid.appendChild(card);
            });
        });
    }

    // ==========================================
    // 8. SEARCH, CATEGORY FILTER AND SORT
    // ==========================================

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

    function getAllCards() {
        return Array.from(
            skillsGrid.querySelectorAll(".explore-card")
        );
    }

    function filterSkills() {
        const searchText = normalize(searchInput ? searchInput.value : "");
        const cards = getAllCards();
        let visibleCount = 0;

        cards.forEach(function (card) {
            const title = card.querySelector("h3");
            const skillName = title ? normalize(title.textContent) : "";
            const cardText = normalize(card.textContent);
            const category = card.dataset.category || "All";

            const matchesSearch =
                !searchText ||
                skillName.includes(searchText) ||
                cardText.includes(searchText);

            const matchesCategory =
                selectedCategory === "All" ||
                category === selectedCategory;

            const visible = matchesSearch && matchesCategory;

            card.style.display = visible ? "" : "none";

            if (visible) {
                visibleCount++;
            }
        });

        if (noResults) {
            noResults.hidden = visibleCount > 0;
        }

        if (resultsCount) {
            resultsCount.textContent =
                "Showing " + visibleCount + " of " + cards.length + " skills";
        }

        if (sortSkills) {
            const sortedCards = [...cards];

            if (sortSkills.value === "name-asc") {
                sortedCards.sort(function (a, b) {
                    return a.querySelector("h3").textContent.trim()
                        .localeCompare(b.querySelector("h3").textContent.trim());
                });
            } else if (sortSkills.value === "name-desc") {
                sortedCards.sort(function (a, b) {
                    return b.querySelector("h3").textContent.trim()
                        .localeCompare(a.querySelector("h3").textContent.trim());
                });
            }

            sortedCards.forEach(function (card) {
                skillsGrid.appendChild(card);
            });
        }
    }

    // ==========================================
    // 9. CATEGORY BUTTONS
    // ==========================================

    categoryButtons.forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.category === selectedCategory
        );

        button.addEventListener("click", function () {
            selectedCategory = button.dataset.category;

            categoryButtons.forEach(function (item) {
                item.classList.toggle("active", item === button);
            });

            filterSkills();
        });
    });

    // ==========================================
    // 10. SEARCH EVENTS
    // ==========================================

    if (searchButton) {
        searchButton.addEventListener("click", filterSkills);
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterSkills);

        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                filterSkills();
            }
        });
    }

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

    if (sortSkills) {
        sortSkills.addEventListener("change", filterSkills);
    }

    // ==========================================
    // 11. INITIALIZE
    // ==========================================
    filterSkills();

});

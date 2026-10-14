document.addEventListener("DOMContentLoaded", function () {

    // Get HTML elements
    const searchInput = document.getElementById("skillSearch");
    const searchButton = document.getElementById("searchButton");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const skillCards = document.querySelectorAll(".explore-card");
    const noResults = document.getElementById("noResults");

    // Read category from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestedCategory = urlParams.get("category");

    // Allow only categories available on the Explore page
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

    // Set the active category button on page load
    categoryButtons.forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.category === selectedCategory
        );
    });

    // Filter skills based on search text and category
    function filterSkills() {

        const searchText = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        let visibleCount = 0;

        skillCards.forEach(function (card) {

            const skillName = card.textContent.toLowerCase();
            const cardCategory = card.dataset.category;

            const matchesSearch = skillName.includes(searchText);

            const matchesCategory =
                selectedCategory === "All" ||
                cardCategory === selectedCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }

        });

        // Show or hide the no-results message
        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }
    }

    // Search button
    if (searchButton) {
        searchButton.addEventListener("click", filterSkills);
    }

    // Live search while typing
    if (searchInput) {
        searchInput.addEventListener("input", filterSkills);

        // Press Enter to search
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                filterSkills();
            }
        });
    }

    // Category button filtering
    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedCategory = button.dataset.category;

            categoryButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            filterSkills();
        });

    });

    // Apply URL category filter when the page first loads
    filterSkills();

    // Save and remove skills using localStorage
const saveButtons = document.querySelectorAll(".save-skill-btn");
const savedStorageKey = "skillswapSavedSkills";

function getSavedSkills() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(savedStorageKey) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function updateSaveButton(button, isSaved) {
    button.classList.toggle("is-saved", isSaved);
    button.textContent = isSaved ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(isSaved));
    button.title = isSaved ? "Remove saved skill" : "Save skill";
}

function getCardSkill(card) {
    const title = card.querySelector(".skill-title-row h3");
    const link = card.querySelector(".view-skill-link");
    const description = card.querySelector(":scope > p:not(.skill-category)");

    return {
        name: title ? title.textContent.trim() : "Skill",
        description: description ? description.textContent.trim() : "",
        category: card.dataset.category || "",
        link: link ? link.getAttribute("href") : "explore.html"
    };
}

// Set the correct heart state when Explore opens
const initialSavedSkills = getSavedSkills();

saveButtons.forEach(function (button) {
    const card = button.closest(".explore-card");

    if (!card) return;

    const skill = getCardSkill(card);

    const isSaved = initialSavedSkills.some(function (saved) {
        return saved && saved.name === skill.name;
    });

    updateSaveButton(button, isSaved);

    button.addEventListener("click", function () {
        const savedSkills = getSavedSkills();

        const existingIndex = savedSkills.findIndex(function (saved) {
            return saved && saved.name === skill.name;
        });

        if (existingIndex !== -1) {
            savedSkills.splice(existingIndex, 1);
            updateSaveButton(button, false);
        } else {
            savedSkills.push(skill);
            updateSaveButton(button, true);
        }

        try {
            localStorage.setItem(
                savedStorageKey,
                JSON.stringify(savedSkills)
            );
        } catch (error) {
            updateSaveButton(button, existingIndex !== -1);
            alert("Could not save this skill. Check browser storage.");
            return;
        }
    });
});

});

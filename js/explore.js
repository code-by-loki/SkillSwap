
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

});


document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("skillSearch");
    const searchButton = document.getElementById("searchButton");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const skillCards = document.querySelectorAll(".explore-card");
    const noResults = document.getElementById("noResults");

    let selectedCategory = "All";

    function filterSkills() {

        const searchText = searchInput.value.toLowerCase().trim();
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

        noResults.style.display =
            visibleCount === 0 ? "block" : "none";
    }

    searchButton.addEventListener("click", filterSkills);

    searchInput.addEventListener("input", filterSkills);

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

});

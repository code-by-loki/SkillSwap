
/* =========================================
   SKILLSWAP HOME PAGE JAVASCRIPT
========================================= */


/* 1. Wait until HTML is fully loaded */

document.addEventListener("DOMContentLoaded", function () {

    console.log("SkillSwap Home Page Loaded!");


    /* =====================================
       2. SMOOTH SCROLL FOR SECTION LINKS
    ===================================== */

    const sectionLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    sectionLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            // Ignore links containing only #
            if (targetId === "#") {
                return;
            }

            const targetSection = document.querySelector(targetId);

            // Scroll only if the target exists
            if (targetSection) {

                event.preventDefault();

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================
       3. HERO BUTTON CLICK EFFECT
    ===================================== */

    const heroButtons = document.querySelectorAll(
        ".hero-buttons a"
    );

    heroButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log(
                "Hero button clicked:",
                this.textContent.trim()
            );

        });

    });


    /* =====================================
       4. SKILL CARD INTERACTIONS
    ===================================== */

    const skillCards = document.querySelectorAll(
        ".skill-card"
    );

    skillCards.forEach(function (card) {

        card.addEventListener("mouseenter", function () {

            console.log(
                "Exploring skill:",
                this.querySelector("h3")?.textContent
            );

        });

    });


    /* =====================================
       5. CURRENT YEAR IN FOOTER
    ===================================== */

    const yearElement = document.getElementById(
        "currentYear"
    );

    if (yearElement) {

        yearElement.textContent = new Date().getFullYear();

    }


    /* =====================================
       6. BACK-TO-TOP BUTTON
    ===================================== */

    const backToTopButton = document.getElementById(
        "backToTop"
    );

    if (backToTopButton) {

        // Show button after scrolling down
        window.addEventListener("scroll", function () {

            if (window.scrollY > 350) {

                backToTopButton.classList.add("visible");

            } else {

                backToTopButton.classList.remove("visible");

            }

        });


        // Scroll to page top when clicked
        backToTopButton.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

});

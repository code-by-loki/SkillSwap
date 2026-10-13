
document.addEventListener("DOMContentLoaded", function () {

    // Find dashboard elements
    const dashboardName = document.getElementById("dashboardName");
    const dashboardSkills = document.getElementById("dashboardSkills");
    const dashboardLogout = document.getElementById("dashboardLogout");
    const dashboardMessage = document.getElementById("dashboardMessage");

    // Read demo profile saved by the existing profile page
    let profile = null;

    try {
        profile = JSON.parse(
            localStorage.getItem("skillswapDemoProfileDetails")
        );
    } catch (error) {
        console.warn("Could not read saved profile details.");
    }

    // Display the user's name when available
    if (profile && dashboardName) {
        const name = profile.name || profile.fullName;

        if (name) {
            dashboardName.textContent = name;
        }
    }

    // Display teach/learn skills if the saved profile contains them
    if (profile && dashboardSkills) {

        const skills = [];

        function addSkills(value, label) {
            if (!value) return;

            const values = Array.isArray(value)
                ? value
                : String(value).split(",");

            values.forEach(function (item) {
                const skill = String(item).trim();

                if (skill) {
                    skills.push({
                        name: skill,
                        type: label
                    });
                }
            });
        }

        addSkills(profile.teachSkills, "Teaching");
        addSkills(profile.learnSkills, "Learning");

        if (skills.length > 0) {

            dashboardSkills.replaceChildren();

            skills.slice(0, 4).forEach(function (skill) {

                const item = document.createElement("div");
                item.className = "dashboard-skill-item";

                const name = document.createElement("h3");
                name.textContent = skill.name;

                const type = document.createElement("p");
                type.textContent = skill.type;

                item.append(name, type);
                dashboardSkills.appendChild(item);
            });

        }
    }

    // Logout demo session
    if (dashboardLogout) {
        dashboardLogout.addEventListener("click", function () {

            sessionStorage.removeItem("skillswapDemoSession");

            window.location.href = "login.html";
        });
    }

    // Explain demo-only sections
    if (dashboardMessage) {
        dashboardMessage.textContent =
            "Dashboard summary counts will update when requests, sessions, and progress features are connected.";
    }

});


document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. GET SELECTED SKILL
    // ==========================================

    const urlParams = new URLSearchParams(window.location.search);
    const selectedSkill = urlParams.get("skill");

    // ==========================================
    // 2. SKILL INFORMATION
    // No hardcoded teacher names
    // ==========================================

    const skills = {
        java: {
            category: "PROGRAMMING",
            title: "Java Programming",
            description:
                "Learn Java fundamentals, object-oriented programming, and practical coding through beginner-friendly exercises.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "</>",
            searchNames: ["java", "java programming", "core java"],
            learning: [
                "Java variables and data types",
                "Conditions and loops",
                "Object-oriented programming basics",
                "Practice through coding exercises"
            ]
        },

        uiux: {
            category: "DESIGN",
            title: "UI/UX Design",
            description:
                "Explore user interface design, user experience principles, and user-friendly digital products.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "✦",
            searchNames: ["uiux", "ui/ux", "ui ux design", "design"],
            learning: [
                "UI and UX fundamentals",
                "Colour combinations and typography",
                "Wireframes and layouts",
                "Basic prototyping concepts"
            ]
        },

        english: {
            category: "LANGUAGES",
            title: "English Speaking",
            description:
                "Improve everyday English through useful vocabulary, friendly conversations, and speaking practice.",
            level: "All Beginner Levels",
            duration: "Flexible Sessions",
            symbol: "Aa",
            searchNames: ["english", "english speaking", "spoken english"],
            learning: [
                "Everyday English sentences",
                "Common words and vocabulary",
                "Speaking with confidence",
                "Simple conversations and pronunciation"
            ]
        },

        photography: {
            category: "PHOTOGRAPHY",
            title: "Photography Basics",
            description:
                "Learn composition, lighting, camera settings, and creative photography.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "◎",
            searchNames: ["photography", "photography basics"],
            learning: [
                "Composition and framing",
                "Lighting and shadows",
                "Camera and mobile settings",
                "Taking creative photographs"
            ]
        },

        guitar: {
            category: "MUSIC",
            title: "Guitar Basics",
            description:
                "Learn basic chords, strumming patterns, and beginner-friendly songs.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "♫",
            searchNames: ["guitar", "guitar basics", "music"],
            learning: [
                "Guitar parts and tuning",
                "Basic guitar chords",
                "Simple strumming patterns",
                "Playing beginner-friendly songs"
            ]
        },

        webdev: {
            category: "PROGRAMMING",
            title: "Web Development",
            description:
                "Learn how websites are built using HTML, CSS, and JavaScript.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "{ }",
            searchNames: [
                "webdev",
                "web development",
                "html",
                "css",
                "javascript"
            ],
            learning: [
                "HTML structure and elements",
                "CSS styling and layouts",
                "JavaScript fundamentals",
                "Building a simple website"
            ]
        }
    };

    // ==========================================
    // 3. GET HTML ELEMENTS
    // ==========================================

    const teachersContainer =
        document.getElementById("registeredTeachers");

    const requestStorageKey = "skillswapDemoRequests";
    const notificationStorageKey = "skillswapNotifications";
    const usersKey = "skillswapDemoUsers";
    const detailsKey = "skillswapDemoProfileDetailsByUser";
    const sessionKey = "skillswapDemoSession";

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    // ==========================================
    // 4. STORAGE HELPERS
    // ==========================================

    function readArray(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.error("Storage read error:", key, error);
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
            console.error("Storage read error:", key, error);
            return {};
        }
    }

    function normalize(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }

    function getMemberName(user, details) {
        return (
            details.name ||
            user.name ||
            "SkillSwap Member"
        );
    }

    // ==========================================
    // 5. VALIDATE SELECTED SKILL
    // ==========================================

    const skill = skills[selectedSkill];

    if (!skill) {
        setText("skillCategory", "SKILL");
        setText("skillTitle", "Skill Not Found");
        setText(
            "skillDescription",
            "This skill could not be found. Please return to Explore Skills and select a valid skill."
        );

        if (teachersContainer) {
            teachersContainer.replaceChildren();

            const message = document.createElement("p");
            message.textContent = "Please select a skill from Explore Skills.";
            teachersContainer.appendChild(message);
        }

        const learningList = document.getElementById("learningList");

        if (learningList) {
            learningList.replaceChildren();
        }

        return;
    }

    // ==========================================
    // 6. DISPLAY SELECTED SKILL DETAILS
    // ==========================================

    setText("skillCategory", skill.category);
    setText("skillTitle", skill.title);
    setText("skillDescription", skill.description);
    setText("skillLevel", skill.level);
    setText("skillDuration", skill.duration);

    const visualSymbol = document.querySelector(".visual-symbol");

    if (visualSymbol) {
        visualSymbol.textContent = skill.symbol;
    }

    const learningList = document.getElementById("learningList");

    if (learningList) {
        learningList.replaceChildren();

        skill.learning.forEach(function (topic) {
            const item = document.createElement("li");
            item.textContent = topic;
            learningList.appendChild(item);
        });
    }

    // ==========================================
    // 7. CHECK WHETHER A USER TEACHES THIS SKILL
    // ==========================================

   
function teachesSelectedSkill(teachSkills) {
    if (!Array.isArray(teachSkills)) {
        return false;
    }

    const aliases = {
        "java": ["java", "core java", "java programming"],
        "uiux": ["uiux", "ui ux", "ui/ux", "ui ux design", "ui/ux design"],
        "english": ["english", "english speaking", "spoken english"],
        "photography": ["photography", "photography basics"],
        "guitar": ["guitar", "guitar basics"],
        "webdev": [
            "webdev",
            "web development",
            "html",
            "css",
            "javascript"
        ]
    };

    const acceptedNames = (aliases[selectedSkill] || skill.searchNames)
        .map(function (name) {
            return normalize(name);
        });

    return teachSkills.some(function (teachSkill) {
        const enteredSkill = normalize(teachSkill);

        return acceptedNames.includes(enteredSkill);
    });
}

    // ==========================================
    // 8. DISPLAY REGISTERED TEACHERS
    // ==========================================

    function renderTeachers() {
        if (!teachersContainer) {
            return;
        }

        teachersContainer.replaceChildren();

        const users = readArray(usersKey);
        const detailsByUser = readObject(detailsKey);
        const currentUserId = sessionStorage.getItem(sessionKey);

        const teachers = users.filter(function (user) {
            if (!user || user.id == null) {
                return false;
            }

            // Don't show the logged-in user as their own teacher.
            if (
                currentUserId &&
                String(user.id) === String(currentUserId)
            ) {
                return false;
            }

            const details = detailsByUser[user.id] || {};

            return teachesSelectedSkill(details.teachSkills);
        });

        if (teachers.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "no-teachers-message";
            emptyMessage.textContent =
                "No teachers registered for this skill yet.";

            teachersContainer.appendChild(emptyMessage);
            return;
        }

        teachers.forEach(function (teacher) {
            const details = detailsByUser[teacher.id] || {};
            const teacherName = getMemberName(teacher, details);

            // Teacher card
            const card = document.createElement("article");
            card.className = "registered-teacher-card";

            // Avatar
            const avatar = document.createElement("div");
            avatar.className = "teacher-avatar";
            avatar.textContent = teacherName.charAt(0).toUpperCase();

            // Teacher information
            const info = document.createElement("div");
            info.className = "registered-teacher-info";

            const name = document.createElement("h3");
            name.textContent = teacherName;

            const role = document.createElement("p");
            role.className = "teacher-role";
            role.textContent = "Registered SkillSwap Member";

            const bio = document.createElement("p");
            bio.className = "teacher-description";
            bio.textContent =
                details.bio || "Ready to share knowledge and learn together.";

            const skillsText = document.createElement("p");
            skillsText.className = "teacher-skills";

            const teacherSkills = Array.isArray(details.teachSkills)
                ? details.teachSkills
                : [];

            skillsText.textContent =
                "Teaching: " + teacherSkills.join(", ");

            info.append(name, role, bio, skillsText);

            // View Profile
            const profileLink = document.createElement("a");
            profileLink.className = "view-profile-button";
            profileLink.href =
                "user-profile.html?userId=" +
                encodeURIComponent(teacher.id);
            profileLink.textContent = "View Profile";

            // Request button
            const requestButton = document.createElement("button");
            requestButton.type = "button";
            requestButton.className = "request-button teacher-request-button";
            requestButton.textContent = "Request to Learn";

            const message = document.createElement("p");
            message.className = "teacher-request-message";
            message.setAttribute("aria-live", "polite");

            requestButton.addEventListener("click", function () {
                sendRequest(teacher, requestButton, message);
            });

            const actions = document.createElement("div");
            actions.className = "teacher-card-actions";
            actions.append(profileLink, requestButton);

            card.append(avatar, info, actions, message);

            teachersContainer.appendChild(card);
        });
    }

    // ==========================================
    // 9. SEND REQUEST TO A SELECTED TEACHER
    // ==========================================

    function sendRequest(teacher, button, messageElement) {
        const senderId = sessionStorage.getItem(sessionKey);

        function showMessage(message, color) {
            messageElement.textContent = message;
            messageElement.style.color = color;
        }

        if (!senderId) {
            showMessage(
                "Please log in before sending a request.",
                "#d9534f"
            );
            return;
        }

        if (String(senderId) === String(teacher.id)) {
            showMessage(
                "You cannot send a request to yourself.",
                "#d9534f"
            );
            return;
        }

        button.disabled = true;
        showMessage("Sending request...", "#3478db");

        try {
            const users = readArray(usersKey);
            const detailsByUser = readObject(detailsKey);

            const sender = users.find(function (user) {
                return String(user.id) === String(senderId);
            });

            const receiver = users.find(function (user) {
                return String(user.id) === String(teacher.id);
            });

            if (!sender || !receiver) {
                showMessage(
                    "Account not found. Please log in again.",
                    "#d9534f"
                );
                return;
            }

            const receiverDetails = detailsByUser[receiver.id] || {};

            // Recheck teaching skill before creating a request.
            if (!teachesSelectedSkill(receiverDetails.teachSkills)) {
                showMessage(
                    "This member is no longer listed for this skill. Refresh the page.",
                    "#d9534f"
                );
                return;
            }

            const senderDetails = detailsByUser[sender.id] || {};

            const senderName = getMemberName(sender, senderDetails);
            const receiverName = getMemberName(receiver, receiverDetails);

            const requests = readArray(requestStorageKey);

            const alreadyRequested = requests.some(function (request) {
                return (
                    String(request.senderId) === String(sender.id) &&
                    String(request.receiverId) === String(receiver.id) &&
                    normalize(request.wantedSkill) === normalize(skill.title) &&
                    normalize(request.status || "Pending") === "pending"
                );
            });

            if (alreadyRequested) {
                showMessage(
                    "You already have a pending request to this teacher for this skill.",
                    "#b7791f"
                );
                return;
            }

            const request = {
                id:
                    Date.now().toString() +
                    Math.random().toString(36).slice(2),

                senderId: sender.id,
                receiverId: receiver.id,
                userName: senderName,
                receiverName: receiverName,
                wantedSkill: skill.title,

                offeredSkill: Array.isArray(senderDetails.teachSkills)
                    ? senderDetails.teachSkills.join(", ") || "To be discussed"
                    : "To be discussed",

                status: "Pending",
                createdAt: new Date().toISOString()
            };

            const notifications = readArray(notificationStorageKey);

            const notification = {
                id:
                    Date.now().toString() +
                    Math.random().toString(36).slice(2),

                userId: receiver.id,
                requestId: request.id,
                type: "new-request",

                message:
                    senderName +
                    " wants to learn " +
                    skill.title +
                    " from you.",

                read: false,
                createdAt: new Date().toISOString()
            };

            // Save request first, then notification.
            localStorage.setItem(
                requestStorageKey,
                JSON.stringify([...requests, request])
            );

            localStorage.setItem(
                notificationStorageKey,
                JSON.stringify([...notifications, notification])
            );

            showMessage(
                "Request sent to " + receiverName + " successfully!",
                "#198754"
            );

            button.textContent = "Request Sent";

        } catch (error) {
            console.error("SkillSwap request error:", error);

            showMessage(
                "Could not send the request. Please try again.",
                "#d9534f"
            );

        } finally {
            button.disabled = false;
        }
    }

    // ==========================================
    // 10. INITIALIZE TEACHER LIST
    // ==========================================

    renderTeachers();

});

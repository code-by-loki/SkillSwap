
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
// SMART MATCHMAKING HELPERS
// ==========================================

// Skill names-ai standard format-ku kondu varum.
function canonicalSkill(value) {
    const normalized = normalize(value)
        .replace(/[^a-z0-9]/g, "");

    const aliases = {
        corejava: "java",
        javaprogramming: "java",

        uiux: "uiuxdesign",
        uiuxdesign: "uiuxdesign",
        uxui: "uiuxdesign",

        spokenenglish: "english",
        englishspeaking: "english",

        photographybasics: "photography",
        guitarbasics: "guitar",

        webdev: "webdevelopment",
        html: "webdevelopment",
        css: "webdevelopment",
        javascript: "webdevelopment"
    };

    return aliases[normalized] || normalized;
}


// Evvalavu skills match aagudhu nu percentage calculate pannum.
function getMatchCoverage(skillsToMatch, offeredSkills) {

    if (
        !Array.isArray(skillsToMatch) ||
        !Array.isArray(offeredSkills) ||
        skillsToMatch.length === 0
    ) {
        return 0;
    }

    const offered = new Set(
        offeredSkills.map(canonicalSkill)
    );

    const wanted = [
        ...new Set(skillsToMatch.map(canonicalSkill))
    ];

    const matched = wanted.filter(function (skillName) {
        return offered.has(skillName);
    }).length;

    return Math.round(
        (matched / wanted.length) * 100
    );
}


// Rendu users-kum mutual match irukka nu check pannum.
function getSmartMatch(currentDetails, teacherDetails) {

    const myTeach = Array.isArray(currentDetails.teachSkills)
        ? currentDetails.teachSkills
        : [];

    const myLearn = Array.isArray(currentDetails.learnSkills)
        ? currentDetails.learnSkills
        : [];

    const theirTeach = Array.isArray(teacherDetails.teachSkills)
        ? teacherDetails.teachSkills
        : [];

    const theirLearn = Array.isArray(teacherDetails.learnSkills)
        ? teacherDetails.learnSkills
        : [];


    // Namma learn panna virumbura skills-ai
    // teacher teach panna mudiyuma?
    const learningCoverage = getMatchCoverage(
        myLearn,
        theirTeach
    );


    // Teacher learn panna virumbura skills-ai
    // namma teach panna mudiyuma?
    const teachingCoverage = getMatchCoverage(
        theirLearn,
        myTeach
    );


    const directions = [
        myLearn.length ? learningCoverage : null,
        theirLearn.length ? teachingCoverage : null
    ].filter(function (value) {
        return value !== null;
    });


    if (directions.length === 0) {
        return null;
    }


    // Rendu direction-oda average percentage.
    const percentage = Math.round(
        directions.reduce(function (sum, value) {
            return sum + value;
        }, 0) / directions.length
    );


    // Rendu direction-layum 100% match irundha Perfect Swap.
    const perfectSwap =
        myLearn.length > 0 &&
        theirLearn.length > 0 &&
        learningCoverage === 100 &&
        teachingCoverage === 100;


    return {
        percentage: percentage,
        perfectSwap: perfectSwap
    };
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
        java: [
            "java",
            "core java",
            "java programming"
        ],
        uiux: [
            "uiux",
            "ui ux",
            "ui/ux",
            "ui ux design",
            "ui/ux design"
        ],
        english: [
            "english",
            "english speaking",
            "spoken english"
        ],
        photography: [
            "photography",
            "photography basics"
        ],
        guitar: [
            "guitar",
            "guitar basics"
        ],
        webdev: [
            "webdev",
            "web development",
            "html",
            "css",
            "javascript"
        ]
    };

    const acceptedNames = (
        aliases[selectedSkill] || skill.searchNames
    ).map(normalize);

    return teachSkills.some(function (teachSkill) {
        return acceptedNames.includes(normalize(teachSkill));
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

            // Current logged-in user details
const currentUser = users.find(function (user) {
    return currentUserId &&
        String(user.id) === String(currentUserId);
});

const currentDetails = currentUser
    ? (detailsByUser[currentUser.id] || {})
    : null;


// Match percentage calculate pannuvom.
const match = currentDetails
    ? getSmartMatch(currentDetails, details)
    : null;


// Badge create pannuvom.
if (match) {

    const matchBadge = document.createElement("div");

    matchBadge.className = match.perfectSwap
        ? "smart-match-badge perfect-swap-badge"
        : "smart-match-badge";


    if (match.perfectSwap) {

        matchBadge.textContent =
            "⚡ PERFECT SWAP MATCH! · 100%";

    } else {

        matchBadge.textContent =
            "✨ Skill Match · " + match.percentage + "%";

    }


    matchBadge.setAttribute(
        "aria-label",
        match.perfectSwap
            ? "Perfect mutual skill swap match, 100 percent"
            : "Skill compatibility " + match.percentage + " percent"
    );


    card.appendChild(matchBadge);
}

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

const message = document.createElement("p");
message.className = "teacher-request-message";
message.setAttribute("aria-live", "polite");

// Check the existing request status
function updateRequestButton() {
    const currentUserId = sessionStorage.getItem(sessionKey);
    const requests = readArray("skillswapDemoRequests");

    const existingRequest = requests.find(function (request) {
        return (
            String(request.senderId) === String(currentUserId) &&
            String(request.receiverId) === String(teacher.id) &&
            String(request.skill || "").toLowerCase() ===
                String(selectedSkill.name || "").toLowerCase() &&
            ["pending", "accepted"].includes(
                String(request.status || "Pending").toLowerCase()
            )
        );
    });

    requestButton.classList.remove("cancel-request-button");

    if (existingRequest) {
        const status = String(
            existingRequest.status || "Pending"
        ).toLowerCase();

        if (status === "pending") {
            requestButton.textContent = "Cancel Request";
            requestButton.classList.add("cancel-request-button");
            requestButton.disabled = false;
        } else {
            requestButton.textContent = "Request Accepted";
            requestButton.disabled = true;
        }
    } else {
        requestButton.textContent = "Request to Learn";
        requestButton.disabled = false;
    }

    return existingRequest;
}

updateRequestButton();

requestButton.addEventListener("click", function () {
    const existingRequest = updateRequestButton();

    if (existingRequest) {
        if (
            String(existingRequest.status || "Pending").toLowerCase() ===
            "pending"
        ) {
            const confirmed = confirm(
                "Are you sure you want to cancel this request?"
            );

            if (!confirmed) {
                return;
            }

            const requests = readArray("skillswapDemoRequests");

            const request = requests.find(function (item) {
                return String(item.id) === String(existingRequest.id);
            });

            if (request) {
                request.status = "Cancelled";
                request.cancelledAt = new Date().toISOString();

                localStorage.setItem(
                    "skillswapDemoRequests",
                    JSON.stringify(requests)
                );

                message.textContent = "Request cancelled successfully.";
                updateRequestButton();
            }
        }

        return;
    }

    sendRequest(teacher, requestButton, message);

    // Refresh the button after the request is sent.
    setTimeout(updateRequestButton, 100);
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

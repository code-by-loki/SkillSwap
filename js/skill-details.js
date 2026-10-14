
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. GET SELECTED SKILL FROM URL
    // ==========================================

    const urlParams = new URLSearchParams(window.location.search);
    const selectedSkill = urlParams.get("skill");

    // ==========================================
    // 2. SKILL DETAILS
    // ==========================================

    const skills = {
        java: {
            category: "PROGRAMMING",
            title: "Java Programming",
            description: "Learn Java fundamentals, object-oriented programming, and practical coding through beginner-friendly exercises.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "</>",
            teacher: "Arun Kumar",
            role: "Java Learner & Skill Sharer",
            teacherDescription: "I enjoy explaining Java concepts, solving coding problems, and helping beginners practise step by step.",
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
            description: "Explore user interface design, user experience principles, and how to create simple, user-friendly digital products.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "✦",
            teacher: "Priya S",
            role: "UI/UX Design Enthusiast",
            teacherDescription: "I enjoy creating clean interfaces and sharing design ideas that make websites and apps easier to use.",
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
            description: "Improve your everyday English through simple conversations, useful vocabulary, and friendly speaking practice.",
            level: "All Beginner Levels",
            duration: "Flexible Sessions",
            symbol: "Aa",
            teacher: "Rahul M",
            role: "English Practice Partner",
            teacherDescription: "I enjoy practising everyday English conversations and helping learners become more confident speakers.",
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
            description: "Learn how to take better photos using composition, lighting, camera settings, and creative observation.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "◎",
            teacher: "Meena K",
            role: "Photography Enthusiast",
            teacherDescription: "I love capturing everyday moments and sharing practical tips to help beginners improve their photography.",
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
            description: "Start your musical journey by learning basic chords, simple strumming patterns, and beginner-friendly songs.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "♫",
            teacher: "Karthik R",
            role: "Guitar Enthusiast",
            teacherDescription: "I enjoy playing guitar and helping beginners get comfortable with basic chords and rhythms.",
            learning: [
                "Guitar parts and tuning",
                "Basic guitar chords",
                "Simple strumming patterns",
                "Playing beginner-friendly songs"
            ]
        },

        webdev: {
            category: "WEB DEVELOPMENT",
            title: "Web Development",
            description: "Discover how websites are built using HTML, CSS, and JavaScript, then practise creating your own web pages.",
            level: "Beginner Friendly",
            duration: "Flexible Sessions",
            symbol: "{ }",
            teacher: "Sanjay V",
            role: "Web Development Enthusiast",
            teacherDescription: "I enjoy building websites and sharing frontend development concepts with people who are just getting started.",
            learning: [
                "HTML structure and elements",
                "CSS styling and layouts",
                "JavaScript fundamentals",
                "Building a simple website"
            ]
        }
    };

    const skill = skills[selectedSkill] || skills.java;

    // ==========================================
    // 3. DISPLAY SKILL DETAILS
    // ==========================================

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    setText("skillCategory", skill.category);
    setText("skillTitle", skill.title);
    setText("skillDescription", skill.description);
    setText("skillLevel", skill.level);
    setText("skillDuration", skill.duration);

    const visualSymbol = document.querySelector(".visual-symbol");

    if (visualSymbol) {
        visualSymbol.textContent = skill.symbol;
    }

    // ==========================================
    // 4. DISPLAY LEARNING TOPICS
    // ==========================================

    const learningList = document.getElementById("learningList");

    if (learningList) {
        learningList.replaceChildren();

        skill.learning.forEach(function (topic) {
            const listItem = document.createElement("li");
            listItem.textContent = topic;
            learningList.appendChild(listItem);
        });
    }

    // ==========================================
    // 5. DISPLAY TEACHER DETAILS
    // ==========================================

    setText("teacherName", skill.teacher);
    setText("teacherRole", skill.role);
    setText("teacherDescription", skill.teacherDescription);

    setText(
        "teacherAvatar",
        skill.teacher.charAt(0).toUpperCase()
    );

    // ==========================================
    // 6. STORAGE KEYS
    // ==========================================

    const requestButton = document.getElementById("requestButton");
    const requestMessage = document.getElementById("requestMessage");

    const requestStorageKey = "skillswapDemoRequests";
    const notificationStorageKey = "skillswapNotifications";
    const usersKey = "skillswapDemoUsers";
    const detailsKey = "skillswapDemoProfileDetailsByUser";
    const sessionKey = "skillswapDemoSession";

    // ==========================================
    // 7. READ ARRAY FROM LOCAL STORAGE
    // ==========================================

    function readArray(key) {
        try {
            const data = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {
            console.error("Could not read array:", key, error);
            return [];
        }
    }

    // ==========================================
    // 8. READ OBJECT FROM LOCAL STORAGE
    // ==========================================

    function readObject(key) {
        try {
            const data = JSON.parse(
                localStorage.getItem(key) || "{}"
            );

            return data &&
                typeof data === "object" &&
                !Array.isArray(data)
                    ? data
                    : {};

        } catch (error) {
            console.error("Could not read object:", key, error);
            return {};
        }
    }

    // ==========================================
    // 9. DISPLAY MESSAGE
    // ==========================================

    function showMessage(message, color) {
        if (!requestMessage) {
            return;
        }

        requestMessage.textContent = message;
        requestMessage.style.color = color;
    }

    // ==========================================
    // 10. HANDLE REQUEST BUTTON
    // ==========================================

    if (requestButton && requestMessage) {

        requestButton.addEventListener("click", function () {

            const senderId = sessionStorage.getItem(sessionKey);

            // Check login.
            if (!senderId) {
                showMessage(
                    "Please log in before sending a request.",
                    "#ffb3bb"
                );
                return;
            }

            // Prevent repeated clicks while saving.
            if (requestButton.disabled) {
                return;
            }

            requestButton.disabled = true;
            showMessage("Sending your request...", "#65a7ff");

            try {
                const users = readArray(usersKey);
                const detailsByUser = readObject(detailsKey);

                // Find sender.
                const sender = users.find(function (user) {
                    return String(user.id) === String(senderId);
                });

                if (!sender) {
                    showMessage(
                        "Your account could not be found. Please log in again.",
                        "#ffb3bb"
                    );
                    return;
                }

                // Find receiver from the URL, if provided.
                const pageParams = new URLSearchParams(
                    window.location.search
                );

                const receiverId = pageParams.get("userId");

                let receiver = receiverId
                    ? users.find(function (user) {
                        return String(user.id) === String(receiverId);
                    })
                    : null;

                // For the original demo skills, match the teacher name.
                if (!receiver && !receiverId) {
                    receiver = users.find(function (user) {
                        const name =
                            detailsByUser[user.id]?.name ||
                            user.name ||
                            "";

                        return name.trim().toLowerCase() ===
                            skill.teacher.trim().toLowerCase();
                    });
                }

                if (!receiver) {
                    showMessage(
                        "This skill does not have a linked registered member yet.",
                        "#ffcc80"
                    );
                    return;
                }

                // Prevent sending a request to yourself.
                if (String(receiver.id) === String(senderId)) {
                    showMessage(
                        "You cannot send a request to yourself.",
                        "#ffcc80"
                    );
                    return;
                }

                const senderDetails = detailsByUser[sender.id] || {};
                const receiverDetails = detailsByUser[receiver.id] || {};

                const senderName =
                    senderDetails.name ||
                    sender.name ||
                    "SkillSwap Member";

                const receiverName =
                    receiverDetails.name ||
                    receiver.name ||
                    skill.teacher;

                const requests = readArray(requestStorageKey);

                // Prevent duplicate pending requests to the same member
                // for the same skill from the same sender.
                const alreadyRequested = requests.some(function (request) {
                    return (
                        String(request.senderId) === String(senderId) &&
                        String(request.receiverId) === String(receiver.id) &&
                        request.wantedSkill === skill.title &&
                        (request.status || "Pending") === "Pending"
                    );
                });

                if (alreadyRequested) {
                    showMessage(
                        "You already have a pending request for this member and skill.",
                        "#ffcc80"
                    );
                    return;
                }

                // Build request object.
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
                        ? senderDetails.teachSkills.join(", ") ||
                          "To be discussed"
                        : "To be discussed",

                    status: "Pending",
                    createdAt: new Date().toISOString()
                };

                const notifications = readArray(
                    notificationStorageKey
                );

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

                // Save request and notification.
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
                    "#72e6a5"
                );

                requestButton.textContent = "Request Sent";

            } catch (error) {
                console.error("SkillSwap request error:", error);

                showMessage(
                    "Could not send your request. Please check the browser console.",
                    "#ffb3bb"
                );

            } finally {
                requestButton.disabled = false;
            }
        });
    }

});

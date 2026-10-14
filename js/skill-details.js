
document.addEventListener("DOMContentLoaded", function () {

    // 1. Get the selected skill from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedSkill = urlParams.get("skill");

    // 2. Store details for all six skills
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

    // 3. Get the selected skill
    const skill = skills[selectedSkill] || skills.java;

    // 4. Display skill details
    document.getElementById("skillCategory").textContent = skill.category;
    document.getElementById("skillTitle").textContent = skill.title;
    document.getElementById("skillDescription").textContent = skill.description;
    document.getElementById("skillLevel").textContent = skill.level;
    document.getElementById("skillDuration").textContent = skill.duration;

    document.querySelector(".visual-symbol").textContent = skill.symbol;

    // 5. Display learning topics
    const learningList = document.getElementById("learningList");
    learningList.replaceChildren();

    skill.learning.forEach(function (topic) {
        const listItem = document.createElement("li");
        listItem.textContent = topic;
        learningList.appendChild(listItem);
    });

    // 6. Display skill partner
    document.getElementById("teacherName").textContent = skill.teacher;
    document.getElementById("teacherRole").textContent = skill.role;
    document.getElementById("teacherDescription").textContent =
        skill.teacherDescription;

    document.getElementById("teacherAvatar").textContent =
        skill.teacher.charAt(0).toUpperCase();

    // 7. Request and notification storage keys
   
    // 7. Request and notification storage keys
    const requestButton = document.getElementById("requestButton");
    const requestMessage = document.getElementById("requestMessage");

    const requestStorageKey = "skillswapDemoRequests";
    const notificationStorageKey = "skillswapNotifications";
    const usersKey = "skillswapDemoUsers";
    const detailsKey = "skillswapDemoProfileDetailsByUser";
    const sessionKey = "skillswapDemoSession";

    function readArray(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function readObject(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "{}");
            return data && typeof data === "object" && !Array.isArray(data)
                ? data
                : {};
        } catch (error) {
            return {};
        }
    }

    function showMessage(message, color) {
        requestMessage.textContent = message;
        requestMessage.style.color = color;
    }

    if (requestButton && requestMessage) {
        requestButton.addEventListener("click", function () {
            const senderId = sessionStorage.getItem(sessionKey);

            if (!senderId) {
                showMessage("Please log in before sending a request.", "#ffb3bb");
                return;
            }

            const users = readArray(usersKey);
            const detailsByUser = readObject(detailsKey);

            const sender = users.find(function (user) {
                return String(user.id) === String(senderId);
            });

            if (!sender) {
                showMessage("Your account could not be found. Please log in again.", "#ffb3bb");
                return;
            }

            // Find the teacher from the selected member profile, if available.
            const pageParams = new URLSearchParams(window.location.search);
            const receiverId = pageParams.get("userId");

            let receiver = receiverId
                ? users.find(function (user) {
                    return String(user.id) === String(receiverId);
                })
                : null;

            // Fallback for the original six demo skill pages.
            if (!receiver && !receiverId) {
                receiver = users.find(function (user) {
                    const name = detailsByUser[user.id]?.name || user.name || "";
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

            if (String(receiver.id) === String(senderId)) {
                showMessage("You cannot send a request to yourself.", "#ffcc80");
                return;
            }

            const receiverDetails = detailsByUser[receiver.id] || {};
            const receiverName =
                receiverDetails.name || receiver.name || skill.teacher;

            const senderDetails = detailsByUser[sender.id] || {};
            const senderName =
                senderDetails.name || sender.name || "SkillSwap Member";

            const requests = readArray(requestStorageKey);

            const alreadyRequested = requests.some(function (request) {
                return String(request.senderId) === String(senderId) &&
                    String(request.receiverId) === String(receiver.id) &&
                    request.wantedSkill === skill.title &&
                    (request.status || "Pending") === "Pending";
            });

            if (alreadyRequested) {
                showMessage("You already have a pending request for this member and skill.", "#ffcc80");
                return;
            }

            const request = {
                id: Date.now().toString() + Math.random().toString(36).slice(2),
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

            notifications.unshift({
                id: Date.now().toString() + Math.random().toString(36).slice(2),
                userId: receiver.id,
                message: senderName + " wants to learn " + skill.title + " from you.",
                read: false,
                createdAt: new Date().toISOString()
            });

            try {
                localStorage.setItem(
                    requestStorageKey,
                    JSON.stringify([...requests, request])
                );

                localStorage.setItem(
                    notificationStorageKey,
                    JSON.stringify(notifications)
                );

                showMessage("Request sent to " + receiverName + " successfully!", "#72e6a5");
                requestButton.textContent = "Request Sent";
                requestButton.disabled = true;
            } catch (error) {
                console.error("SkillSwap request error:", error);
                showMessage("Could not save the request. Please try again.", "#ffb3bb");
            }
        });
    }


    // 8. Send request when the button is clicked
    if (requestButton && requestMessage) {
        requestButton.addEventListener("click", function () {

            requestButton.disabled = true;
            requestMessage.textContent = "Sending your request...";
            requestMessage.style.color = "#65a7ff";

            try {
                const requests = readStorage(requestStorageKey);
                const notifications = readStorage(notificationStorageKey);

                // Prevent accidental duplicate pending requests
                const alreadyRequested = requests.some(function (request) {
                    return request.wantedSkill === skill.title &&
                        request.status === "Pending";
                });

                if (alreadyRequested) {
                    requestMessage.textContent =
                        "You already have a pending request for " +
                        skill.title + ".";
                    requestMessage.style.color = "#ffcc80";
                    return;
                }

                // Create the request
                const request = {
                    id: Date.now().toString() +
                        Math.random().toString(36).slice(2),
                    userName: skill.teacher,
                    wantedSkill: skill.title,
                    offeredSkill: "To be discussed",
                    status: "Pending",
                    createdAt: new Date().toISOString()
                };

                // Create the notification
                const notification = {
                    id: Date.now().toString() +
                        Math.random().toString(36).slice(2),
                    message: "Your request to learn " + skill.title +
                        " has been sent. Status: Pending.",
                    read: false,
                    createdAt: new Date().toISOString()
                };

                // Save both
                requests.push(request);
                notifications.unshift(notification);

                localStorage.setItem(
                    requestStorageKey,
                    JSON.stringify(requests)
                );

                localStorage.setItem(
                    notificationStorageKey,
                    JSON.stringify(notifications)
                );

                requestMessage.textContent =
                    "Request sent successfully! Your request for " +
                    skill.title + " is pending.";
                requestMessage.style.color = "#72e6a5";

            } catch (error) {
                console.error("SkillSwap request error:", error);

                requestMessage.textContent =
                    "Could not send your request. Please check the browser console.";
                requestMessage.style.color = "#ffb3bb";

            } finally {
                requestButton.disabled = false;
            }
        });
    }
});

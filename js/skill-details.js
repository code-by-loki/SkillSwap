
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
    const requestButton = document.getElementById("requestButton");
    const requestMessage = document.getElementById("requestMessage");

    const requestStorageKey = "skillswapDemoRequests";
    const notificationStorageKey = "skillswapNotifications";

    function readStorage(key) {
        const savedData = localStorage.getItem(key);

        if (savedData === null) {
            return [];
        }

        const parsedData = JSON.parse(savedData);

        if (!Array.isArray(parsedData)) {
            throw new Error(key + " does not contain a valid array.");
        }

        return parsedData;
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

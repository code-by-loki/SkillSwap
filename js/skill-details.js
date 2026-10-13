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

    // 3. Find the selected skill
    const skill = skills[selectedSkill] || skills.java;

    // 4. Display the selected skill details
    document.getElementById("skillCategory").textContent = skill.category;
    document.getElementById("skillTitle").textContent = skill.title;
    document.getElementById("skillDescription").textContent = skill.description;
    document.getElementById("skillLevel").textContent = skill.level;
    document.getElementById("skillDuration").textContent = skill.duration;

    // 5. Update the visual symbol
    document.querySelector(".visual-symbol").textContent = skill.symbol;

    // 6. Display the learning topics
    const learningList = document.getElementById("learningList");
    learningList.replaceChildren();

    skill.learning.forEach(function (topic) {
        const listItem = document.createElement("li");
        listItem.textContent = topic;
        learningList.appendChild(listItem);
    });

    // 7. Update the skill partner
    document.getElementById("teacherName").textContent = skill.teacher;
    document.getElementById("teacherRole").textContent = skill.role;
    document.getElementById("teacherDescription").textContent =
        skill.teacherDescription;

    document.getElementById("teacherAvatar").textContent =
        skill.teacher.charAt(0).toUpperCase();

    // 8. Handle the Request to Learn button
    const requestButton = document.getElementById("requestButton");
    const requestMessage = document.getElementById("requestMessage");

    requestButton.addEventListener("click", function () {
        requestMessage.textContent =
            "Demo only: Your request to learn " + skill.title +
            " has been prepared. Backend connection is not available yet.";

        requestMessage.style.color = "#65a7ff";
    });

});

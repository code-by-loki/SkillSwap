document.addEventListener("DOMContentLoaded", function () {
    const USERS_KEY = "skillswapDemoUsers";
    const DETAILS_KEY = "skillswapDemoProfileDetailsByUser";
    const SESSION_KEY = "skillswapDemoSession";
    const REQUESTS_KEY = "skillswapDemoRequests";
    const NOTIFICATIONS_KEY = "skillswapNotifications";

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    const userName = document.getElementById("userName");
    const userBio = document.getElementById("userBio");
    const userAbout = document.getElementById("userAbout");
    const userAvatar = document.getElementById("userAvatar");
    const teachSkillList = document.getElementById("teachSkillList");
    const learnSkillList = document.getElementById("learnSkillList");
    const requestSkill = document.getElementById("requestSkill");
    const offerSkill = document.getElementById("offerSkill");
    const sendButton = document.getElementById("sendRequestBtn");
    const requestMessage = document.getElementById("requestMessage");

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

    function renderSkills(container, skills) {
        container.replaceChildren();

        if (!Array.isArray(skills) || skills.length === 0) {
            const empty = document.createElement("span");
            empty.textContent = "No skills added yet";
            container.appendChild(empty);
            return;
        }

        skills.forEach(function (skill) {
            const tag = document.createElement("span");
            tag.className = "user-skill";
            tag.textContent = skill;
            container.appendChild(tag);
        });
    }

    const users = readArray(USERS_KEY);
    const details = readObject(DETAILS_KEY);

    const member = users.find(function (user) {
        return String(user.id) === String(userId);
    });

    if (!userId || !member) {
        userName.textContent = "Member not found";
        userBio.textContent = "This profile could not be found.";
        userAbout.textContent = "";
        userAvatar.textContent = "?";
        renderSkills(teachSkillList, []);
        renderSkills(learnSkillList, []);
        sendButton.disabled = true;
        return;
    }

    const profile = details[member.id] || {};
    const name = profile.name || member.name || "SkillSwap Member";
    const bio = profile.bio || "I enjoy sharing my knowledge and learning from the community.";
    const teachSkills = Array.isArray(profile.teachSkills)
        ? profile.teachSkills
        : [];
    const learnSkills = Array.isArray(profile.learnSkills)
        ? profile.learnSkills
        : [];

    userName.textContent = name;
    userBio.textContent = bio;
    userAbout.textContent = bio;
    userAvatar.textContent = name.charAt(0).toUpperCase();

    renderSkills(teachSkillList, teachSkills);
    renderSkills(learnSkillList, learnSkills);

    // Populate the request dropdown with this member's teaching skills.
    requestSkill.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose a skill";
    requestSkill.appendChild(placeholder);

    teachSkills.forEach(function (skill) {
        const option = document.createElement("option");
        option.value = skill;
        option.textContent = skill;
        requestSkill.appendChild(option);
    });

    const currentUserId = sessionStorage.getItem(SESSION_KEY);

    if (!currentUserId) {
        sendButton.disabled = true;
        showMessage("Please log in before sending a request.", "#ffb3bb");
    } else if (String(currentUserId) === String(member.id)) {
        sendButton.disabled = true;
        showMessage("You cannot send a request to your own profile.", "#ffcc80");
    }

    sendButton.addEventListener("click", function () {
        const senderId = sessionStorage.getItem(SESSION_KEY);
        const wanted = requestSkill.value.trim();
        const offered = offerSkill.value.trim();

        if (!senderId) {
            showMessage("Please log in before sending a request.", "#ffb3bb");
            return;
        }

        if (String(senderId) === String(member.id)) {
            showMessage("You cannot send a request to yourself.", "#ffcc80");
            return;
        }

        if (!wanted) {
            showMessage("Please choose a skill you want to learn.", "#ffb3bb");
            requestSkill.focus();
            return;
        }

        if (!offered) {
            showMessage("Please enter a skill you can offer.", "#ffb3bb");
            offerSkill.focus();
            return;
        }

        const sender = users.find(function (user) {
            return String(user.id) === String(senderId);
        });

        if (!sender) {
            showMessage("Your login session is invalid. Please log in again.", "#ffb3bb");
            return;
        }

        const senderProfile = details[sender.id] || {};
        const senderName = senderProfile.name || sender.name || "SkillSwap Member";

        const requests = readArray(REQUESTS_KEY);

        const duplicate = requests.some(function (request) {
            return String(request.senderId) === String(senderId) &&
                String(request.receiverId) === String(member.id) &&
                request.wantedSkill === wanted &&
                (request.status || "Pending") === "Pending";
        });

        if (duplicate) {
            showMessage("You already have a pending request for this skill.", "#ffcc80");
            return;
        }

        const request = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            senderId: sender.id,
            receiverId: member.id,
            userName: senderName,
            receiverName: name,
            wantedSkill: wanted,
            offeredSkill: offered,
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        const notifications = readArray(NOTIFICATIONS_KEY);

        notifications.unshift({
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            userId: member.id,
            message: senderName + " wants to learn " + wanted + " from you.",
            read: false,
            createdAt: new Date().toISOString()
        });

        try {
            localStorage.setItem(
                REQUESTS_KEY,
                JSON.stringify([...requests, request])
            );

            localStorage.setItem(
                NOTIFICATIONS_KEY,
                JSON.stringify(notifications)
            );

            showMessage("Request sent to " + name + " successfully!", "#72e6a5");
            sendButton.textContent = "Request Sent";
            sendButton.disabled = true;

            console.log("SkillSwap request saved:", request);
        } catch (error) {
            console.error("Could not save request:", error);
            showMessage("Could not save the request. Please try again.", "#ffb3bb");
        }
    });
});
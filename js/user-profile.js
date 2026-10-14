
document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("sendRequestBtn");
    const requestSkill = document.getElementById("requestSkill");
    const offerSkill = document.getElementById("offerSkill");
    const requestMessage = document.getElementById("requestMessage");
    const userNameElement = document.getElementById("userName");

    const requestStorageKey = "skillswapDemoRequests";
    const notificationStorageKey = "skillswapNotifications";

    // Check whether the request form exists.
    if (
        !sendButton ||
        !requestSkill ||
        !offerSkill ||
        !requestMessage ||
        !userNameElement
    ) {
        console.error("SkillSwap: One or more request form elements are missing.");
        return;
    }

    function showMessage(message, color) {
        requestMessage.textContent = message;
        requestMessage.style.color = color;
    }

    function readStorage(key) {
        const rawData = localStorage.getItem(key);

        if (rawData === null) {
            return [];
        }

        const data = JSON.parse(rawData);

        if (!Array.isArray(data)) {
            throw new Error(key + " must contain an array.");
        }

        return data;
    }

    sendButton.addEventListener("click", function () {
        const wanted = requestSkill.value.trim();
        const offered = offerSkill.value.trim();

        if (!wanted) {
            showMessage(
                "Please choose a skill you want to learn.",
                "#ffb3bb"
            );
            requestSkill.focus();
            return;
        }

        if (!offered) {
            showMessage(
                "Please enter a skill you can offer.",
                "#ffb3bb"
            );
            offerSkill.focus();
            return;
        }

        const request = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            userName: userNameElement.textContent.trim() || "SkillSwap Member",
            wantedSkill: wanted,
            offeredSkill: offered,
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        try {
            const requests = readStorage(requestStorageKey);
            const notifications = readStorage(notificationStorageKey);

            requests.push(request);

            notifications.unshift({
                id: Date.now().toString() + Math.random().toString(36).slice(2),
                message:
                    "Your skill exchange request for " +
                    wanted +
                    " has been sent. You offered " +
                    offered +
                    ". Status: Pending.",
                read: false,
                createdAt: new Date().toISOString()
            });

            // Save request first.
            localStorage.setItem(
                requestStorageKey,
                JSON.stringify(requests)
            );

            // Then save notification.
            localStorage.setItem(
                notificationStorageKey,
                JSON.stringify(notifications)
            );

            showMessage(
                "Request sent successfully! Your request is saved.",
                "#72e6a5"
            );

            requestSkill.value = "";
            offerSkill.value = "";

            console.log("SkillSwap request saved:", request);
            console.log("SkillSwap notification saved.");

        } catch (error) {
            console.error("SkillSwap request/notification error:", error);

            showMessage(
                "Could not save your request. Check the browser console and storage.",
                "#ffb3bb"
            );
        }
    });
});

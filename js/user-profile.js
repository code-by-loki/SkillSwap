
document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("sendRequestBtn");
    const requestSkill = document.getElementById("requestSkill");
    const offerSkill = document.getElementById("offerSkill");
    const requestMessage = document.getElementById("requestMessage");

    sendButton.addEventListener("click", function () {
        const wanted = requestSkill.value;
        const offered = offerSkill.value.trim();

        if (!wanted) {
            requestMessage.textContent = "Please choose a skill you want to learn.";
            requestMessage.style.color = "#ffb3bb";
            requestSkill.focus();
            return;
        }

        if (!offered) {
            requestMessage.textContent = "Please enter a skill you can offer.";
            requestMessage.style.color = "#ffb3bb";
            offerSkill.focus();
            return;
        }

        const request = {
            userName: document.getElementById("userName").textContent,
            wantedSkill: wanted,
            offeredSkill: offered,
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        const storageKey = "skillswapDemoRequests";
        let requests = [];

        try {
            const savedRequests = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            if (Array.isArray(savedRequests)) {
                requests = savedRequests;
            }

            requests.push(request);
            localStorage.setItem(storageKey, JSON.stringify(requests));

            requestMessage.textContent =
                "Demo request saved! Your request is pending.";
            requestMessage.style.color = "#72e6a5";

            requestSkill.value = "";
            offerSkill.value = "";
        } catch (error) {
            requestMessage.textContent =
                "Could not save the demo request. Please check browser storage.";
            requestMessage.style.color = "#ffb3bb";
        }
    });
});

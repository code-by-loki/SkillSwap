
document.addEventListener("DOMContentLoaded", function () {

    const requestButton = document.getElementById("requestButton");
    const requestMessage = document.getElementById("requestMessage");

    requestButton.addEventListener("click", function () {

        requestMessage.textContent =
            "Your interest is noted on this page. Sign in and connect with the skill partner when request functionality is available.";

        requestMessage.style.color = "#72e6a5";

    });

});

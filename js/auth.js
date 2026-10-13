
document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const password =
                document.getElementById("registerPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const message =
                document.getElementById("registerMessage");

            if (password !== confirmPassword) {
                message.textContent = "Passwords do not match.";
                message.style.color = "#ff7777";
                return;
            }

            message.textContent =
                "Form validation successful! Backend registration is not connected yet.";

            message.style.color = "#72e6a5";
        });
    }

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const message =
                document.getElementById("loginMessage");

            message.textContent =
                "Form validation successful! Backend login is not connected yet.";

            message.style.color = "#72e6a5";
        });
    }

});

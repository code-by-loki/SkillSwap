document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    const PROFILE_KEY = "skillswapDemoProfile";
    const SESSION_KEY = "skillswapDemoSession";

    // REGISTER
    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("fullName").value.trim();
            const email = document.getElementById("registerEmail").value.trim().toLowerCase();
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const message = document.getElementById("registerMessage");

            if (password !== confirmPassword) {
                message.textContent = "Passwords do not match.";
                message.style.color = "#ff7777";
                return;
            }

            if (password.length < 6) {
                message.textContent = "Password must contain at least 6 characters.";
                message.style.color = "#ff7777";
                return;
            }

            try {
                // Demo profile only. Never save the password.
                localStorage.setItem(PROFILE_KEY, JSON.stringify({
                    name: name,
                    email: email
                }));

                message.textContent =
                    "Demo profile saved! You can now continue to Login.";
                message.style.color = "#72e6a5";

                const link = document.createElement("a");
                link.href = "login.html";
                link.textContent = " Go to Login";
                link.style.color = "#65a7ff";

                message.appendChild(document.createElement("br"));
                message.appendChild(link);

            } catch (error) {
                message.textContent = "Unable to save demo profile in this browser.";
                message.style.color = "#ff7777";
            }
        });
    }

    // LOGIN
    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const password = document.getElementById("loginPassword").value;
            const message = document.getElementById("loginMessage");

            try {
                const savedProfile = localStorage.getItem(PROFILE_KEY);

                if (!savedProfile) {
                    message.textContent = "Please register a demo profile first.";
                    message.style.color = "#ff7777";
                    return;
                }

                const profile = JSON.parse(savedProfile);

                if (profile.email !== email) {
                    message.textContent = "Email not found. Please check your email or register first.";
                    message.style.color = "#ff7777";
                    return;
                }

                // Password cannot be verified securely without a backend.
                // This is explicitly a demo-only navigation, not real authentication.
                if (password.length < 6) {
                    message.textContent = "Please enter at least 6 characters for the password.";
                    message.style.color = "#ff7777";
                    return;
                }

                sessionStorage.setItem(SESSION_KEY, email);

                message.textContent =
                    "Demo navigation only: password is not being authenticated. Opening your profile...";
                message.style.color = "#72e6a5";

                setTimeout(function () {
                    window.location.href = "profile.html";
                }, 1200);

            } catch (error) {
                message.textContent =
                    "Unable to read demo profile. Please register again.";
                message.style.color = "#ff7777";
            }
        });
    }

});

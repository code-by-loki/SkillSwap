
document.addEventListener("DOMContentLoaded", function () {

    const USERS_KEY = "skillswapDemoUsers";
    const SESSION_KEY = "skillswapDemoSession";

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    // Read all registered demo users
    function getUsers() {
        const savedUsers = localStorage.getItem(USERS_KEY);

        if (!savedUsers) {
            return [];
        }

        const users = JSON.parse(savedUsers);

        if (!Array.isArray(users)) {
            throw new Error("Invalid user data.");
        }

        return users;
    }

    // Save all registered demo users
    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // =========================
    // REGISTER
    // =========================

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("fullName").value.trim();
            const email = document.getElementById("registerEmail")
                .value.trim().toLowerCase();

            const password = document.getElementById("registerPassword").value;
            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const message = document.getElementById("registerMessage");

            if (!name || !email) {
                message.textContent = "Please enter your name and email.";
                message.style.color = "#ff7777";
                return;
            }

            if (password.length < 6) {
                message.textContent =
                    "Password must contain at least 6 characters.";
                message.style.color = "#ff7777";
                return;
            }

            if (password !== confirmPassword) {
                message.textContent = "Passwords do not match.";
                message.style.color = "#ff7777";
                return;
            }

            try {
                const users = getUsers();

                const emailExists = users.some(function (user) {
                    return user.email === email;
                });

                if (emailExists) {
                    message.textContent =
                        "This email is already registered. Please login.";
                    message.style.color = "#ff7777";
                    return;
                }

                const newUser = {
                    id: "user_" + Date.now() +
                        "_" + Math.random().toString(36).slice(2),
                    name: name,
                    email: email,
                    password: password
                };

                users.push(newUser);
                saveUsers(users);

                message.textContent =
                    "Registration successful! Please login.";

                message.style.color = "#72e6a5";

                const link = document.createElement("a");
                link.href = "login.html";
                link.textContent = " Go to Login";
                link.style.color = "#65a7ff";

                message.appendChild(document.createElement("br"));
                message.appendChild(link);

            } catch (error) {
                console.error("Registration error:", error);

                message.textContent =
                    "Could not register. Please check browser storage.";
                message.style.color = "#ff7777";
            }
        });
    }

    // =========================
    // LOGIN
    // =========================

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail")
                .value.trim().toLowerCase();

            const password =
                document.getElementById("loginPassword").value;

            const message = document.getElementById("loginMessage");

            try {
                const users = getUsers();

                const matchedUser = users.find(function (user) {
                    return user.email === email &&
                        user.password === password;
                });

                if (!matchedUser) {
                    message.textContent =
                        "Invalid email or password.";
                    message.style.color = "#ff7777";
                    return;
                }

                // Store only the current user's ID in this tab's session
                sessionStorage.setItem(
                    SESSION_KEY,
                    matchedUser.id
                );

                message.textContent =
                    "Login successful! Opening your profile...";

                message.style.color = "#72e6a5";

                setTimeout(function () {
                    window.location.href = "profile.html";
                }, 700);

            } catch (error) {
                console.error("Login error:", error);

                message.textContent =
                    "Could not login. Please check browser storage.";
                message.style.color = "#ff7777";
            }
        });
    }

});

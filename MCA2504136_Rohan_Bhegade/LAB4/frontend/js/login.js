const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const getApiBaseUrl = () => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://localhost:5000";
    }

    return "";
};

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        togglePassword.classList.toggle("fa-eye-slash", type === "text");
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const apiBaseUrl = getApiBaseUrl();

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("userId", data.user._id);
                localStorage.setItem("userRole", data.user.role);
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("userName", data.user.name || data.user.email);

                alert("Login Successful");

                if (data.user.role === "admin") {
                    window.location.href = "admin.html";
                } else if (data.user.role === "teacher") {
                    window.location.href = "teacher.html";
                } else {
                    window.location.href = "student.html";
                }
            } else {
                alert(data.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Unable to connect to the server. Please make sure the backend is running.");
        }
    });
}
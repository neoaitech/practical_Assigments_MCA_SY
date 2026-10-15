const registerForm = document.getElementById("registerForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        togglePassword.classList.toggle("fa-eye-slash", type === "text");
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value;

        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert("Registration successful. Please login.");
                window.location.href = "login.html";
            } else {
                alert(data.message || "Registration failed.");
            }
        } catch (err) {
            alert("Server error. Please try again later.");
            console.error(err);
        }
    });
}

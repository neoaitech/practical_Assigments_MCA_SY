// ==========================
// Contact Form Submission
// ==========================
const form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.querySelector('input[type="email"]').value;
        const message = document.querySelector("textarea").value;

        if (email.trim() === "" || message.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }

        alert("Thank you! Your message has been submitted successfully.");

        form.reset();
    });
}
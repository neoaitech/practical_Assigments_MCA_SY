const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const table = document.getElementById("registrationTable");
const refreshBtn = document.getElementById("refreshBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    college: document.getElementById("college").value,
    event: document.getElementById("event").value
  };

  try {
    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    message.textContent = result.message;
    message.className = "success";
    form.reset();
    loadRegistrations();
  } catch (error) {
    message.textContent = error.message;
    message.className = "error";
  }
});

async function loadRegistrations() {
  try {
    const response = await fetch("/api/registrations");
    const registrations = await response.json();

    table.innerHTML = "";

    registrations.forEach((item) => {
      const row = document.createElement("tr");
      [item.name, item.email, item.phone, item.college, item.event].forEach(
        (value) => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        }
      );
      table.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

refreshBtn.addEventListener("click", loadRegistrations);
loadRegistrations();

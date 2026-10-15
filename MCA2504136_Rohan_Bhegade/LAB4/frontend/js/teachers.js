const token = localStorage.getItem("token");

const form = document.getElementById("teacherForm");

form.addEventListener("submit", saveTeacher);

async function saveTeacher(e) {

    e.preventDefault();

    const teacherId = document.getElementById("teacherId").value;

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    let url = "http://localhost:5000/api/teachers";

    let method = "POST";

    if (teacherId) {

        url += "/" + teacherId;

        method = "PUT";

    }

    const response = await fetch(url, {

        method,

        headers: {

            "Content-Type": "application/json",

            Authorization: "Bearer " + token

        },

        body: JSON.stringify({

            name,

            email,

            password

        })

    });

    const data = await response.json();

    alert(data.message);

    form.reset();

    document.getElementById("teacherId").value = "";

    document.getElementById("saveBtn").innerHTML =
        '<i class="fa-solid fa-floppy-disk"></i> Save Teacher';

    loadTeachers();

}

async function loadTeachers() {

    const response = await fetch("http://localhost:5000/api/teachers", {

        headers: {

            Authorization: "Bearer " + token

        }

    });

    const data = await response.json();

    const table = document.getElementById("teacherTable");

    table.innerHTML = "";

    data.teachers.forEach(teacher => {

        table.innerHTML += `

        <tr>

            <td>${teacher.name}</td>

            <td>${teacher.email}</td>

            <td>

                <button onclick="editTeacher('${teacher._id}')">

                    Edit

                </button>

                <button onclick="deleteTeacher('${teacher._id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

function editTeacher(id) {

    fetch("http://localhost:5000/api/teachers", {

        headers: {

            Authorization: "Bearer " + token

        }

    })

    .then(res => res.json())

    .then(data => {

        const teacher = data.teachers.find(t => t._id === id);

        if (!teacher) return;

        document.getElementById("teacherId").value = teacher._id;

        document.getElementById("name").value = teacher.name;

        document.getElementById("email").value = teacher.email;

        document.getElementById("saveBtn").innerHTML =
            '<i class="fa-solid fa-pen"></i> Update Teacher';

    });

}

async function deleteTeacher(id) {

    if (!confirm("Delete this teacher?")) return;

    const response = await fetch(

        "http://localhost:5000/api/teachers/" + id,

        {

            method: "DELETE",

            headers: {

                Authorization: "Bearer " + token

            }

        }

    );

    const data = await response.json();

    alert(data.message);

    loadTeachers();

}

loadTeachers();
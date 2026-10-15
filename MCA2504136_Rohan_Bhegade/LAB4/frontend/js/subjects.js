const token = localStorage.getItem("token");

const form = document.getElementById("subjectForm");

form.addEventListener("submit", saveSubject);

async function saveSubject(e) {

    e.preventDefault();

    const id = document.getElementById("subjectId").value;

    const name = document.getElementById("name").value;

    const code = document.getElementById("code").value;

    const semester = document.getElementById("semester").value;

    let url = "http://localhost:5000/api/subjects";

    let method = "POST";

    if (id) {

        url += "/" + id;

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

            code,

            semester

        })

    });

    const data = await response.json();

    alert(data.message);

    form.reset();

    document.getElementById("subjectId").value = "";

    document.getElementById("saveBtn").innerHTML =
        '<i class="fa-solid fa-floppy-disk"></i> Save Subject';

    loadSubjects();

}

async function loadSubjects() {

    const response = await fetch("http://localhost:5000/api/subjects", {

        headers: {

            Authorization: "Bearer " + token

        }

    });

    const data = await response.json();

    const table = document.getElementById("subjectTable");

    table.innerHTML = "";

    data.subjects.forEach(subject => {

        table.innerHTML += `

        <tr>

            <td>${subject.name}</td>

            <td>${subject.code}</td>

            <td>${subject.semester}</td>

            <td>

                <button onclick="editSubject('${subject._id}')">

                    Edit

                </button>

                <button onclick="deleteSubject('${subject._id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

function editSubject(id) {

    fetch("http://localhost:5000/api/subjects", {

        headers: {

            Authorization: "Bearer " + token

        }

    })

    .then(res => res.json())

    .then(data => {

        const subject = data.subjects.find(s => s._id === id);

        if (!subject) return;

        document.getElementById("subjectId").value = subject._id;

        document.getElementById("name").value = subject.name;

        document.getElementById("code").value = subject.code;

        document.getElementById("semester").value = subject.semester;

        document.getElementById("saveBtn").innerHTML =
            '<i class="fa-solid fa-pen"></i> Update Subject';

    });

}

async function deleteSubject(id) {

    if (!confirm("Delete this subject?")) return;

    const response = await fetch(

        "http://localhost:5000/api/subjects/" + id,

        {

            method: "DELETE",

            headers: {

                Authorization: "Bearer " + token

            }

        }

    );

    const data = await response.json();

    alert(data.message);

    loadSubjects();

}

loadSubjects();
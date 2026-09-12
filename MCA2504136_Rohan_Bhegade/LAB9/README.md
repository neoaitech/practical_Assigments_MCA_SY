# College Event Registration — Docker + MongoDB + Jenkins

A simple full-stack college event registration application:
- Frontend: HTML/CSS/JavaScript
- Backend: Node.js + Express
- Database: MongoDB
- Containerization: Docker + Docker Compose
- Persistence: named Docker volume `mongo-data`
- CI/CD: Jenkins declarative pipeline

## Application
Open http://localhost:5000

The registration form stores:
- name
- email
- phone
- college
- event

Registrations can be viewed from the "View Registrations" section.

## 1. Run locally with Docker Compose

Requirements:
- Docker Desktop
- Git
- Jenkins (for CI/CD)

From this project directory:

```powershell
docker compose up --build -d
docker compose ps
docker compose logs backend
```

Open:
http://localhost:5000

## 2. Test persistence

Register a few users.

Check MongoDB data:

```powershell
docker exec -it college-event-mongo mongosh
```

Then:

```javascript
use college_event
db.registrations.find().pretty()
exit
```

Stop containers:

```powershell
docker compose down
```

Start again:

```powershell
docker compose up -d
```

The registrations should still exist because MongoDB uses the named volume `mongo-data`.

IMPORTANT:
`docker compose down -v` deletes the named volume and therefore deletes the stored database data.

## 3. Jenkins

The included Jenkinsfile builds the backend image and runs a Docker Compose deployment.

Before using Jenkins:
1. Put this project in a GitHub repository.
2. Make sure the Jenkins machine has Docker available.
3. Create a Jenkins Pipeline job.
4. Configure the job to use your GitHub repository.
5. Build the job.

For a Jenkins container, Docker access requires a suitable Docker-outside-of-Docker setup. The exact configuration depends on how Jenkins is installed.

## 4. Useful commands

```powershell
docker compose ps
docker compose logs -f backend
docker compose logs -f mongo
docker compose restart backend
docker compose down
docker compose down -v
docker volume ls
docker volume inspect college-event-registration_mongo-data
```

## Architecture

Browser -> Express backend -> MongoDB
                 |
              Docker
                 |
        Named volume for persistence

Jenkins -> Docker Compose -> Backend + MongoDB

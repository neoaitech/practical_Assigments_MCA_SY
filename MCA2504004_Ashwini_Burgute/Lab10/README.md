# College Event Registration — Flask + MongoDB + Docker + Jenkins

## Architecture

Browser → Flask/Gunicorn container → MongoDB container → named Docker volume

## Run locally with Docker

```bash
docker compose up -d --build
```

Open:
- http://localhost:5000
- http://localhost:5000/registrations
- http://localhost:5000/health

## Verify MongoDB

```bash
docker exec -it college-event-mongo mongosh
```

Then:

```javascript
use college_event_db
db.registrations.find().pretty()
```

## Persistence test WITH volume

1. Register a student.
2. Run `docker compose down`.
3. Run `docker compose up -d`.
4. Open `/registrations`.
5. The registration remains because `mongo_data` is a named volume.

To intentionally delete the persistent data:

```bash
docker compose down -v
```

## Persistence test WITHOUT volume

Use:

```bash
docker compose -f docker-compose-no-volume.yml up -d --build
```

Register a student, then:

```bash
docker compose -f docker-compose-no-volume.yml down
docker compose -f docker-compose-no-volume.yml up -d
```

The data disappears because MongoDB's `/data/db` was not backed by a volume.

## Jenkins

Create a Pipeline job connected to the GitHub repository. The included Jenkinsfile runs:

- checkout
- Docker Compose build
- application startup
- health check
- smoke test
- log archival

For a Windows Jenkins controller, Jenkins must run under an account that can execute Docker Desktop commands.

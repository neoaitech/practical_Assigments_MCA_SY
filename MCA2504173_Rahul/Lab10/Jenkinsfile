pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "college-event"
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Check Docker") {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage("Build") {
            steps {
                sh 'docker compose build'
            }
        }

        stage("Start Application") {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage("Check Containers") {
            steps {
                sh 'docker compose ps'
            }
        }

        stage("Health Check") {
            steps {
                sh '''
                    echo "Waiting for application to start..."

                    for i in {1..30}; do
                        if curl -f http://localhost:5000/health; then
                            echo "Application is healthy!"
                            exit 0
                        fi

                        echo "Application not ready yet. Attempt $i/30"
                        sleep 2
                    done

                    echo "Application failed to become healthy."
                    docker compose logs --no-color
                    exit 1
                '''
            }
        }

        stage("Smoke Test") {
            steps {
                sh '''
                    echo "Running smoke test..."

                    for i in {1..10}; do
                        if curl -f http://localhost:5000/; then
                            echo "Smoke test passed!"
                            exit 0
                        fi

                        echo "Application not ready. Attempt $i/10"
                        sleep 2
                    done

                    echo "Smoke test failed."
                    exit 1
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose logs --no-color > docker-logs.txt || true'

            archiveArtifacts(
                artifacts: 'docker-logs.txt',
                allowEmptyArchive: true
            )
        }

        success {
            echo 'College Event Registration application deployed successfully.'
        }

        failure {
            sh 'docker compose ps || true'

            echo 'Deployment failed. Check docker-logs.txt for details.'
        }
    }
}

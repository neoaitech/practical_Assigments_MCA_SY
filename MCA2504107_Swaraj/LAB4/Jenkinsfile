pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling code from GitHub'
                checkout scm
            }
        }


        stage('Build Docker Compose') {
            steps {
                echo 'Building Docker Images'

                sh '''
                docker-compose build
                '''
            }
        }


        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping old containers'

                sh '''
                docker-compose down
                '''
            }
        }


        stage('Deploy Application') {
            steps {
                echo 'Starting application'

                sh '''
                docker-compose up -d
                '''
            }
        }


        stage('Check Deployment') {
            steps {
                echo 'Checking running containers'

                sh '''
                docker ps
                '''
            }
        }
    }


    post {

        success {
            echo '================================'
            echo 'Deployment Successful!'
            echo '================================'
        }

        failure {
            echo '================================'
            echo 'Deployment Failed!'
            echo '================================'
        }

    }
}
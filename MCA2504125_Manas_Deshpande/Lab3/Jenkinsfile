pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Manas-Deshpande/jenkins-demo-pipeline.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pip3 install --break-system-packages -r requirements.txt'
            }
        }

        stage('Run Test') {
            steps {
                sh 'python3 -m pytest'
            }
        }

        stage('Build Completed') {
            steps {
                echo 'Application Build Successful'
            }
        }
    }
}
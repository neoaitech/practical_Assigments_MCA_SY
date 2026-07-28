Create:
Jenkinsfile
Add:
pipeline {

    agent any

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/YOUR_USERNAME/jenkins-demo-pipeline.git'
            }
        }


        stage('Install Dependencies') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }


        stage('Run Test') {
            steps {
                sh 'pytest'
            }
        }


        stage('Build Completed') {
            steps {
                echo 'Application Build Successful'
            }
        }

    }
}

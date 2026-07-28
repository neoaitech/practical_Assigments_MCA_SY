pipeline {
    agent any
    stages {
        stage('Clone Code') {
            steps {
                git 'https://github.com/bytebyAparna/jenkins-demo-pipeline.git'
            }
        }
        stage('Install Python') {
            steps {
                sh 'apt-get update && apt-get install -y python3 python3-pip'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'pip3 install -r requirements.txt'
            }
        }
        stage('Run Test') {
            steps {
                sh 'python3 -m pytest -v'
            }
        }
        stage('Build Completed') {
            steps {
                echo 'Application Build Successful'
            }
        }
    }
}
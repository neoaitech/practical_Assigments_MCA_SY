pipeline{
    agent any
    stages{
        stage('Clone Code'){
            steps{
                git branch: 'main',
                    url: 'https://github.com/mauryavibhav75/jenkins-demo-pipeline.git'
            }
        }
        stage('Install Dependencies'){
            steps{
                sh 'pip install --break-system-packages -r requirements.txt'
            }
        }
        stage('Run Tests'){
            steps{
                sh 'python3 -m pytest'
            }
        }
        stage('Build Completed'){
            steps{
                echo 'Application Build Successfully'
            }
        }
    }
}
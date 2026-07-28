pipeline{
    agent any
    stages{
        stage('Clone Code'){
            steps{
                git 'https://github.com/RahulKP41/jenkins-demo-pipeline.git'
            }
        }
        stage('Install Dependencies'){
            steps{
                sh 'pip install -r requirements.txt'
            }
        }
        stage('Run Tests'){
            steps{
                sh 'pytest'
            }
        }
        stage('Build Completed'){
            steps{
                echo 'Application Build Successfully'
            }
        }
    }
}
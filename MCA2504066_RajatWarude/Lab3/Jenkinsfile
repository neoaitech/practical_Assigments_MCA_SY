pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/bhawana59/jenkins-demo-pipeline.git'
            }
        }

        stage('Install Dependencies') {
    steps {
        sh 'python3 -m pip install --break-system-packages -r requirements.txt'
        sh 'python3 -m pip install --break-system-packages pytest'
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
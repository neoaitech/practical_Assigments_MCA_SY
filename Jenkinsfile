pipeline {
    agent {
        docker { 
            image 'python:3.11' 
            args '-u root' 
        }
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }
        
        stage('Run Application') {
            steps {
                sh 'python app.py'
            }
        }
        
        stage('Run Unit Tests') {
            steps {
                sh 'pytest --junitxml=reports/test-results.xml'
            }
        }
        
        stage('Code Quality') {
            steps {
                sh 'flake8 . || true'
            }
        }
        
        stage('Generate Coverage') {
            steps {
                sh 'coverage run -m pytest'
                sh 'coverage xml -o reports/coverage.xml'
            }
        }
        
        stage('Publish Test Results') {
            steps {
                junit 'reports/test-results.xml'
            }
        }
        
        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'reports/*.xml', fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo "Pipeline Completed Successfully"
        }
        failure {
            echo "Pipeline Failed"
        }
    }
}
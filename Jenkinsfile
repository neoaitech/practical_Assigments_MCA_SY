node {
    stage('Checkout') {
        checkout scm
    }
    
    stage('Install Dependencies') {
        sh 'pip3 install -r requirements.txt'
    }
    
    stage('Run Application') {
        sh 'python3 app.py'
    }
    
    stage('Run Unit Tests') {
        sh 'pytest --junitxml=reports/test-results.xml'
    }
    
    stage('Code Quality') {
        sh 'flake8 . || true'
    }
    
    stage('Generate Coverage') {
        sh 'coverage run -m pytest'
        sh 'coverage xml -o reports/coverage.xml'
    }
    
    stage('Publish Test Results') {
        junit 'reports/test-results.xml'
    }
    
    stage('Archive Reports') {
        archiveArtifacts artifacts: 'reports/*.xml', fingerprint: true
    }
    
    stage('Finish') {
        echo "Pipeline Completed Successfully"
    }
}
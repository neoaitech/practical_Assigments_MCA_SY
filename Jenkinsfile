node {

    stage('Checkout') {
        checkout scm
    }

    stage('Create Virtual Environment') {
        bat 'python -m venv venv'
    }

    stage('Install Dependencies') {
        bat 'venv\\Scripts\\activate && pip install -r requirements.txt'
    }

    stage('Run Application') {
        bat 'venv\\Scripts\\activate && python app.py'
    }

    stage('Run Unit Tests') {
        bat 'venv\\Scripts\\activate && pytest --junitxml=reports\\test-results.xml'
    }

    stage('Code Quality') {
        bat 'venv\\Scripts\\activate && flake8 . --output-file=reports\\flake8-report.txt || exit 0'
    }

    stage('Generate Coverage') {
        bat 'venv\\Scripts\\activate && coverage run -m pytest'
        bat 'venv\\Scripts\\activate && coverage xml -o reports\\coverage.xml'
    }

    stage('Publish Test Results') {
        junit 'reports\\test-results.xml'
    }

    stage('Archive Reports') {
        archiveArtifacts artifacts: 'reports\\*.xml, reports\\*.txt', fingerprint: true
    }

    stage('Finish') {
        echo "Pipeline Completed Successfully"
    }
}
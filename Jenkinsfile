node {

    stage('Checkout') {
        checkout scm
    }

    stage('Create Virtual Environment') {
        sh 'python3 -m venv venv'
    }

    stage('Install Dependencies') {
        sh '. venv/bin/activate && pip install -r requirements.txt'
    }

    stage('Run Application') {
        sh '. venv/bin/activate && python app.py'
    }

    stage('Run Unit Tests') {
        sh '. venv/bin/activate && pytest'
    }

    stage('Code Quality') {
        sh '. venv/bin/activate && flake8 .'
    }

    stage('Generate Coverage') {
        sh '. venv/bin/activate && coverage run -m pytest'
        sh '. venv/bin/activate && coverage xml'
    }

    stage('Archive Reports') {
        archiveArtifacts artifacts: '*.xml', fingerprint: true
    }

    stage('Finish') {
        echo "Pipeline Completed Successfully"
    }

}
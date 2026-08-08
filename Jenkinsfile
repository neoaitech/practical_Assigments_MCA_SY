node {
    def pythonCommand = isUnix() ? '.venv/bin/python' : '.venv/Scripts/python.exe'
    def runCommand = { String command ->
        if (isUnix()) {
            sh command
        } else {
            bat command
        }
    }

    stage('Checkout') {
        checkout scm
    }

    stage('Create Virtual Environment') {
        runCommand("python -m venv .venv")
    }

    stage('Install Dependencies') {
        runCommand("${pythonCommand} -m pip install -r requirements.txt")
    }

    stage('Run Unit Tests') {
        runCommand("${pythonCommand} -m pytest")
    }

    stage('Code Quality') {
        runCommand("${pythonCommand} -m flake8 . --exclude=.venv")
    }

    stage('Generate Coverage') {
        runCommand("${pythonCommand} -m coverage run -m pytest")
        runCommand("${pythonCommand} -m coverage xml")
    }

    stage('Archive Reports') {
        archiveArtifacts artifacts: 'coverage.xml', fingerprint: true
    }

    stage('Finish') {
        echo 'Pipeline completed successfully'
    }
}

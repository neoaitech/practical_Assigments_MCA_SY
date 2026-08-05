node {

    stage('Checkout') {
        checkout scm
    }

    stage('Build') {
        echo "Building Project"
    }

    stage('Run Python') {
        sh 'ls -l'
        sh 'python3 h.py'
    }

    stage('Finish') {
        echo "Pipeline Completed Successfully"
    }
}
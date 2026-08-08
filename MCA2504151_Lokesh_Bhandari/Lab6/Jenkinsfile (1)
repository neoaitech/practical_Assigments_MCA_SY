node {

    stage('Checkout') {
        checkout scm
    }

    stage('Create Virtual Environment') {
        sh 'python3 -m venv venv || true'
    }

    stage('Install Dependencies') {
        sh '''
        if [ -d "venv" ]; then
            . venv/bin/activate
            pip install --break-system-packages -r requirements.txt
        else
            pip3 install --break-system-packages -r requirements.txt
        fi
        '''
    }

    stage('Run Application') {
        sh '''
        if [ -d "venv" ]; then
            . venv/bin/activate
            python app.py
        else
            python3 app.py
        fi
        '''
    }

    stage('Run Unit Tests') {
        sh '''
        if [ -d "venv" ]; then
            . venv/bin/activate
            python -m pytest
        else
            python3 -m pytest
        fi
        '''
    }

   stage('Code Quality') {
    sh '''
    if [ -d "venv" ]; then
        . venv/bin/activate
        python -m flake8 app.py calculator.py test_calculator.py
    else
        python3 -m flake8 app.py calculator.py test_calculator.py
    fi
    '''
}

    stage('Generate Coverage') {
        sh '''
        if [ -d "venv" ]; then
            . venv/bin/activate
            python -m coverage run -m pytest
            python -m coverage xml
        else
            python3 -m coverage run -m pytest
            python3 -m coverage xml
        fi
        '''
    }

    stage('Archive Reports') {
        archiveArtifacts artifacts: '*.xml', fingerprint: true
    }

    stage('Finish') {
        echo "Pipeline Completed Successfully"
    }

}
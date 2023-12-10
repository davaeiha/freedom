//Jenkinsfile (Declarative Pipeline)

pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh 'docker pull  davaeiha/freedom:1.0'
                sh 'docker run -p 3333:3333 davaeiha/freedom:1.0'
            }
        }
    }
}

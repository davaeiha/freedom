//Jenkinsfile (Declarative Pipeline)
def gv

pipeline {
    agent any
    environment {
        SECRET_FILE = credentials('Freedom-prod-env')
    }
    parameters {
        string(name: 'TAG', defaultValue: '1.0')
    }
    stages {
        stage('init') {
            steps {
                script {
                    gv = load 'script.groovy'
                }
            }
        }
        stage('build') {
            steps {
                script {
                    sh "cat $SECRET_FILE > .env"
                    gv.buildImage()
                }
            }
        }
    }
}

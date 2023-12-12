//Jenkinsfile (Declarative Pipeline)
def gv

pipeline {
    agent any
    environment {
        SECRET_FILE = credentials('Freedom-prod-env')
    }
    stages {
        stage('init') {
            steps {
                script {
                    gv = load 'script.groovy'
                }
            }
        }

        stage('version') {
            steps {
                script {
                    gv.incrementVersion()
                }
            }
        }

        stage('commit-version-github') {
            steps {
                script {
                    gv.commitGithub()
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

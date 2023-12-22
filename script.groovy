/* groovylint-disable FactoryMethodName */
def incrementVersion() {
    echo 'incrementing version...'
    sh 'yarn version --patch --no-git-tag-version'
}

def buildImage() {
    echo 'building the freedom image...'

    def version = sh(
        script: 'npm pkg get version|tr --delete \\"',
        returnStdout: true
    ).trim()

    withCredentials([
        usernamePassword(credentialsId:'dockerhub-cred',
        passwordVariable: 'PASS',
        usernameVariable:'USER')
    ]) {
        sh "docker build -t davaeiha/freedom:$version ."
        sh "echo $PASS | docker login -u $USER --password-stdin"
        sh "docker push davaeiha/freedom:$version"
    }
}

def commitGithub() {
    sshagent(['github-ssh']) {
        sh 'git config --global user.name davaeiha'
        sh 'git config --global user.email m.m.davaeiha@gmail.com'
        sh 'git remote set-url origin git@github.com:davaeiha/freedom.git'
        sh 'git add .'
        sh 'git commit -m \"new version: added\"'
        sh 'git push origin HEAD:master'
    }
}

return this

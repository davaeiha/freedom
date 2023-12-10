def buildImage() {
    echo 'building the freedom image...'

    withCredentials([
        usernamePassword(credentialsId:'dockerhub-cred',
        passwordVariable: 'PASS',
        usernameVariable:'USER')
    ]) {
        sh "docker build -t davaeiha/freedom:${params.TAG} ."
        sh "echo $PASS | docker login -u $USER --password-stdin"
        sh "docker push davaeiha/freedom:${params.TAG}"
    }
}

return this

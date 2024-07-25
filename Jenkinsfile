agent any
environment {
    DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
    DEPLOYMENT_SERVER_SSH = credentials('deployment-server-ssh')
}
stages {
    stage('Checkout') {
        steps {
            git url: 'https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107.git', branch: 'dev', credentialsId: 'gitlab'
        }
    }
    stage('Build Backend') {
        when {
            changeset "**/backend/**"  // 백엔드 코드가 변경된 경우
        }
        steps {
            sh 'chmod +x ./gradlew'
            sh './gradlew clean build'
        }
    }
    stage('Build Backend Docker Image') {
            changeset "**/backend/**"  // 백엔드 코드가 변경된 경우
        }
        steps {
            sh 'docker build -t siokim002/jenkins_backend:${env.BUILD_ID} .'
        }
    }
    stage('Push Backend Docker Image') {
        when {
            changeset "**/backend/**"  // 백엔드 코드가 변경된 경우
        steps {
            script {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push siokim002/jenkins_backend:${env.BUILD_ID}'
            }
        }
    }
    stage('Build Frontend') {
        when {
            changeset "**/frontend/**"  // 프론트엔드 코드가 변경된 경우
        }
        steps {
            dir('frontend') {
                sh 'npm install'
            }
        }
    }
    stage('Build Frontend Docker Image') {
            changeset "**/frontend/**"  // 프론트엔드 코드가 변경된 경우
        }
        steps {
            dir('frontend') {
            }
        }
    }
    stage('Push Frontend Docker Image') {
        when {
            changeset "**/frontend/**"  // 프론트엔드 코드가 변경된 경우
        }
        steps {
            script {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push siokim002/jenkins_frontend:${env.BUILD_ID}'
            }
        }
    }
    stage('Deploy to Deployment Server') {
        steps {
            sshagent(['deployment-server-ssh']) {
                sh 'ssh -o StrictHostKeyChecking=no deployuser@i11c107.p.ssafy.io "bash -s" < deploy_back.sh'
                sh 'ssh -o StrictHostKeyChecking=no deployuser@i11c107.p.ssafy.io "bash -s" < deploy_front.sh'
            }
        }
    }
}
pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107.git', branch: 'test-dev', credentialsId: 'gitlab'
            }
        }
        stage('Build Backend') {
            when {
                changeset "**/backend/**"  // 백엔드 코드가 변경된 경우
            }
            steps {
                dir('backend') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build'
                }
            }
        }
        stage('Build Backend Docker Image') {
            when {
                changeset "**/backend/**"  // 백엔드 코드가 변경된 경우
            }
            steps {
                dir('backend') {
                    sh 'docker build -t siokim002/jenkins_backend .'
                }
            }
        }
        stage('Push Backend Docker Image') {
            when {
                changeset "**/backend/**"  // 백엔드 코드가 변경된 경우
            }
            steps {
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push siokim002/jenkins_backend'
                    sh 'ssh deployuser@i11c107.p.ssafy.io "bash /home/deployuser/deploy_back.sh"'
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
            when {
                changeset "**/frontend/**"  // 프론트엔드 코드가 변경된 경우
            }
            steps {
                dir('frontend') {
                    sh 'docker build -t siokim002/jenkins_frontend .'
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
                    sh 'docker push siokim002/jenkins_frontend'
                    sh 'ssh deployuser@i11c107.p.ssafy.io "bash /home/deployuser/deploy_front.sh"'
                }
            }
        }
    }
}
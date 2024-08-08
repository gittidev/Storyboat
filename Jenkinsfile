pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
    }
    // test
    stages {
        // stage('Start Notification') {
        //     steps {
        //         script {
        //             def gitCommitterName = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
        //             def gitCommitMessage = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim()
                    
        //             mattermostSend(
        //                 color: 'warning',
        //                 message: """젠킨스 시작: ${env.JOB_NAME} #${env.BUILD_NUMBER}
        //                 커밋 작성자: ${gitCommitterName}
        //                 커밋 메시지: ${gitCommitMessage}
        //                 (<${env.BUILD_URL}|Details>)""",
        //                 endpoint: 'https://meeting.ssafy.com/hooks/1psxfrtocfyubrb6jrpd7daoay',
        //                 channel: 'Jenkins---C107'
        //             )
        //         }
        //     }
        // }

        stage('Checkout') {
            steps {
                git url: 'https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107.git', branch: 'dev', credentialsId: 'gitlab'
            }
        }

        stage('Build Backend') {
            when {
                changeset "**/backend/**"
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
                changeset "**/backend/**"
            }
            steps {
                dir('backend') {
                    sh 'docker build -t siokim002/jenkins_backend .'
                }
            }
        }

        stage('Push Backend Docker Image') {
            when {
                changeset "**/backend/**"
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
                changeset "**/frontend/**"
            }
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            when {
                changeset "**/frontend/**"
            }
            steps {
                dir('frontend') {
                    sh 'docker build -t siokim002/jenkins_frontend .'
                }
            }
        }

        stage('Push Frontend Docker Image') {
            when {
                changeset "**/frontend/**"
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

    // post {
    //     success {
    //         script {
    //             def gitCommitterName = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
    //             def gitCommitMessage = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim()
                
    //             mattermostSend(
    //                 color: 'good',
    //                 message: """빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER}
    //                 커밋 작성자: ${gitCommitterName}
    //                 커밋 메시지: ${gitCommitMessage}
    //                 (<${env.BUILD_URL}|Details>)""",
    //                 endpoint: 'https://meeting.ssafy.com/hooks/1psxfrtocfyubrb6jrpd7daoay',
    //                 channel: 'Jenkins---C107'
    //             )
    //         }
    //     }
    //     failure {
    //         script {
    //             def gitCommitterName = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
    //             def gitCommitMessage = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim()
                
    //             mattermostSend(
    //                 color: 'danger',
    //                 message: """빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER}
    //                 커밋 작성자: ${gitCommitterName}
    //                 커밋 메시지: ${gitCommitMessage}
    //                 (<${env.BUILD_URL}|Details>)""",
    //                 endpoint: 'https://meeting.ssafy.com/hooks/1psxfrtocfyubrb6jrpd7daoay',
    //                 channel: 'Jenkins---C107',
    //                 failOnError: true
    //             )
    //         }
    //     }
    // }
}

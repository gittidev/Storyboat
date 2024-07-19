pipeline {
		// 어떤 jenkins 에이전트든 실행 가능
    agent any

		// pipeline 환경변수
    environment {
		    // credentials('{dockerhub credential id}'), 젠킨스에 저장된 변수 가져오기
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
    }

    stages {
		    //
        stage('Checkout') {
            steps {
          		  // credentialId '{github credential id}'
                git url: 'https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107.git', branch: 'master', credentialsId: 'gitlab'
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    docker-compose build
                    docker-compose push
                }
            }
        }

        stage('Run Docker Containers') {
            steps {
                script {
                    docker-compose up -d
                }
            }
        }
    }
    post {
        always {
            script {
                docker-compose down
            }
        }
    }
}

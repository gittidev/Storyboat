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
        stage('Build') {
            steps {
                // Gradle executable permissions 허용
                sh 'chmod +x ./gradlew'

                // build the project using Gradle Wrapper
                sh './gradlew clean build'
            }
        }

        stage('Build Docker Image') {
            steps {
		            // Dockerhub link
                sh 'docker build -t siokim002/jenkins_test .'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
								// Dockerhub link
                sh 'docker push siokim002/jenkins_test'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                    docker stop jenkins_test || true
                    docker rm jenkins_test || true
                    docker run -d -p 80:8080 --name jenkins_test siokim002/jenkins_test
                '''
            }
        }
    }
}

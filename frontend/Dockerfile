# Docker Image 빌드시 Java 기본환경 설정
FROM node:17

# /app 으로 작업 디렉토리 지정
WORKDIR /app

# jar파일을 복사해서 app.jar로 생성
COPY . .

RUN npm install
RUN npm run build

# 컨테이너 외부 통신시 8080포트로 설정
EXPOSE 80

# java -jar app.jar 컨테이너 시작시 명령어 실행
ENTRYPOINT ["npm", "run", "serve"]
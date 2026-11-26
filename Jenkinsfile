
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building AMD64 Docker image'
                sh 'docker build --platform linux/amd64 -t swathilakshmanan/swathi-devops-app:v1 .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing image to Docker Hub'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push swathilakshmanan/swathi-devops-app:v1
                    '''
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                echo 'Deploying application to EC2'

                sshagent(credentials: ['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@15.207.88.211 '
                            sudo docker pull swathilakshmanan/swathi-devops-app:v1 &&
                            (sudo docker rm -f swathi-capstone || true) &&
                            sudo docker run -d --name swathi-capstone -p 80:3000 --restart unless-stopped swathilakshmanan/swathi-devops-app:v1
                        '
                    '''
                }
            }
        }
    }
}


pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code'
                checkout scm
            }
        }

        stage('Test') {
            steps {
                echo 'Running Node.js application tests'
                sh '''
                    set -e
                    TEST_CONTAINER="capstone-test-${BUILD_NUMBER}"

                    cleanup() {
                        docker rm -f "$TEST_CONTAINER" >/dev/null 2>&1 || true
                    }
                    trap cleanup EXIT

                    docker create --name "$TEST_CONTAINER" node:24 sleep 300
                    docker start "$TEST_CONTAINER"
                    docker exec "$TEST_CONTAINER" mkdir -p /app
                    docker cp "$WORKSPACE/." "$TEST_CONTAINER:/app"
                    docker exec -w /app "$TEST_CONTAINER" sh -c "npm install && npm test"
                '''
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

        stage('Verify EC2 Backup and Cron') {
            steps {
                echo 'Checking existing backup scripts and cron jobs'

                sshagent(credentials: ['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@15.207.88.211 '
                            echo "===== USER CRONTAB ====="
                            crontab -l 2>&1 || true

                            echo "===== ROOT CRONTAB ====="
                            sudo crontab -l 2>&1 || true

                            echo "===== SYSTEM CRON FOLDERS ====="
                            ls -la /etc/cron.d /etc/cron.daily 2>/dev/null || true

                            echo "===== BACKUP SCRIPTS ====="
                            find /home/ubuntu -maxdepth 3 -type f -iname "*backup*" -print 2>/dev/null

                            echo "===== CLEANUP SCRIPTS ====="
                            find /home/ubuntu -maxdepth 3 -type f -iname "*cleanup*" -print 2>/dev/null
                        '
                    '''
                }
            }
        }
    }
}

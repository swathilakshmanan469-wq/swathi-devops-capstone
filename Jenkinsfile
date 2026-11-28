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
                sshagent(credentials: ['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@172.31.3.131 '
                            sudo docker pull swathilakshmanan/swathi-devops-app:v1 &&
                            (sudo docker rm -f swathi-capstone || true) &&
                            sudo docker run -d --name swathi-capstone -p 80:3000 --restart unless-stopped swathilakshmanan/swathi-devops-app:v1
                        '
                    '''
                }
            }
        }

        stage('Setup Backup and Cron Automation') {
            steps {
                echo 'Setting up automated application log backup and cleanup'

                sshagent(credentials: ['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@172.31.3.131 'sudo bash -s' <<'REMOTE'
set -e

mkdir -p /var/backups/swathi-capstone
chmod 750 /var/backups/swathi-capstone

cat > /usr/local/sbin/swathi-capstone-backup.sh <<'SCRIPT'
#!/bin/bash
set -euo pipefail

BACKUP_DIR="/var/backups/swathi-capstone"
STAMP=$(date -u +%Y%m%d_%H%M%S)
TEMP_FILE="$BACKUP_DIR/app-logs-$STAMP.txt.gz.tmp"
FINAL_FILE="$BACKUP_DIR/app-logs-$STAMP.txt.gz"

mkdir -p "$BACKUP_DIR"

/usr/bin/docker logs --since 24h --timestamps swathi-capstone 2>&1 | /usr/bin/gzip -c > "$TEMP_FILE"

mv "$TEMP_FILE" "$FINAL_FILE"

find "$BACKUP_DIR" -type f -name 'app-logs-*.txt.gz' -mtime +7 -delete

echo "Backup completed: $FINAL_FILE"
SCRIPT

chmod 750 /usr/local/sbin/swathi-capstone-backup.sh

cat > /etc/cron.d/swathi-capstone-backup <<'CRON'
0 1 * * * root /usr/local/sbin/swathi-capstone-backup.sh >> /var/log/swathi-capstone-backup.log 2>&1
CRON

chmod 644 /etc/cron.d/swathi-capstone-backup

systemctl enable --now cron

echo "===== RUNNING FIRST BACKUP ====="
/usr/local/sbin/swathi-capstone-backup.sh

echo "===== BACKUP FILES ====="
ls -lh /var/backups/swathi-capstone/

echo "===== CRON SCHEDULE ====="
cat /etc/cron.d/swathi-capstone-backup

REMOTE
                    '''
                }
            }
        }
    }
}
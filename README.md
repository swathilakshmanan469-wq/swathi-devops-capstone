# SkillVerse AI - DevOps Capstone Project

## Project Description

SkillVerse AI is a simple Node.js and Express web application used to demonstrate an end-to-end DevOps delivery workflow. Application source code is stored in GitHub. Jenkins runs on a dedicated AWS EC2 instance and automates testing, Docker image build, Docker Hub publishing, deployment to a separate application EC2 instance, and backup/cron setup. Prometheus, Node Exporter, and Grafana provide infrastructure monitoring.

## Technology Stack

| Layer | Technology |
|---|---|
| Application | Node.js, Express.js |
| Source control | Git, GitHub |
| CI/CD | Jenkins (AWS EC2) |
| Containerization | Docker |
| Image registry | Docker Hub |
| Cloud infrastructure | AWS EC2, Ubuntu |
| Monitoring | Prometheus, Node Exporter, Grafana |
| Automation | Bash, Cron |

## Repository Contents

- `server.js` - Express application and health endpoint
- `public/` - web page assets
- `test/` - automated Node.js tests
- `Dockerfile` - application container definition
- `Jenkinsfile` - CI/CD pipeline
- `package.json`, `package-lock.json` - dependencies and scripts

## Prerequisites

For local execution, install:
- Node.js 24 or a compatible supported Node.js release
- npm
- Git
- Docker (only for container execution)

## Run Locally

```bash
git clone https://github.com/swathilakshmanan469-wq/swathi-devops-capstone.git
cd swathi-devops-capstone
npm install
npm test
npm start
```

Open:
- Home page: http://localhost:3000/
- Health check: http://localhost:3000/health

The health endpoint returns application status.

## Run with Docker

Build the Linux AMD64 image:

```bash
docker build --platform linux/amd64 -t swathilakshmanan/swathi-devops-app:v1 .
```

Run locally:

```bash
docker run -d --name swathi-capstone-container -p 3000:3000 swathilakshmanan/swathi-devops-app:v1
docker ps
```

Stop and remove the local test container:

```bash
docker rm -f swathi-capstone-container
```

## CI/CD Pipeline Flow

The Jenkins job is named `Swathi-DevOps-Capstone`. Its pipeline stages are:

1. **Checkout** - retrieve the latest source from the GitHub `main` branch.
2. **Test** - run the Node.js test suite in a temporary Node.js container. The verified run passed 2 tests with 0 failures.
3. **Build Docker Image** - build the app image for `linux/amd64`.
4. **Push to Docker Hub** - authenticate with a Jenkins-stored credential and push `swathilakshmanan/swathi-devops-app:v1`.
5. **Deploy to AWS EC2** - connect from the Jenkins EC2 instance to the application EC2 instance over the same-VPC private IP, pull the image, replace the application container, and publish host port 80 to container port 3000.
6. **Backup and Cron Automation** - install a Bash script, create an initial compressed application-log backup, schedule daily backups at 01:00 server time, and remove backup archives older than 7 days.

The verified successful pipeline checked out commit `00774522afa5bcd4472f56d49ab65781a2243250` and completed every stage successfully.

## Deployment and Monitoring

- Live application: http://15.207.88.211
- Jenkins UI: http://3.110.117.177:8080 (restricted by AWS security-group rules)
- Prometheus: http://15.207.88.211:9090
- Grafana: http://15.207.88.211:3000

The application runs as Docker container `swathi-capstone` on the application EC2 instance. Prometheus and Grafana display CPU, memory, disk, and network metrics collected through Node Exporter.

## Backup and Retention

The backup script stores compressed application container logs under:

`/var/backups/swathi-capstone`

A cron job runs daily at 01:00 server time. Backup archives older than 7 days are deleted. This retention cleanup applies to the backup archive files; it does not truncate the original Docker container logs.

## Deployment Environment

- AWS Region: Asia Pacific (Mumbai), `ap-south-1`
- Jenkins server: `Jenkins-Server`, Ubuntu 26.04.1 LTS, `t3.small`
- Application/monitoring server: `DVP-Week14-Monitoring`, Ubuntu, `t3.micro`
- Application server private IP used by Jenkins: `172.31.3.131`
- Docker image: `swathilakshmanan/swathi-devops-app:v1`

## Security Notes

- Docker Hub and SSH credentials are stored in Jenkins Credentials.
- Private keys, passwords, and access tokens must never be committed to this repository.
- Jenkins and monitoring interfaces should remain restricted to trusted IP addresses.
- Review AWS resource usage and charges regularly.

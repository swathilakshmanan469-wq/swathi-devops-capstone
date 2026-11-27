SkillVerse AI – DevOps Capstone Project
Project Description
SkillVerse AI is a simple Node.js and Express.js web application used for the DevOps Capstone project. The project demonstrates an end-to-end delivery workflow: source code is maintained in GitHub, tested and packaged through Jenkins, containerized with Docker, published to Docker Hub, and deployed to an AWS EC2 Ubuntu instance. Prometheus and Grafana are used for infrastructure monitoring. A Bash script and cron job automate application log backups and retention cleanup.
Technology Stack
Layer	Technology
Application	Node.js, Express.js
Source control	Git, GitHub
CI/CD	Jenkins
Containerization	Docker
Image registry	Docker Hub
Cloud hosting	AWS EC2, Ubuntu
Monitoring	Prometheus, Grafana, Node Exporter
Automation	Bash, Cron


Application Endpoints
- Home page: http://localhost:3000/
- Health check: http://localhost:3000/health
The health endpoint returns the application's status.
Prerequisites
Install the following tools before running the application locally:
- Node.js and npm
- Git
- Docker (only if running the containerized version)
Run Locally
1. Clone the repository:
   git clone https://github.com/swathilakshmanan469-wq/swathi-devops-capstone.git
   cd swathi-devops-capstone
2. Install dependencies:
   npm install
3. Start the application:
   npm start
4. Open the application:
   - http://localhost:3000/
   - http://localhost:3000/health
Run with Docker
Build the image:
docker build --platform linux/amd64 -t swathilakshmanan/swathi-devops-app:v1 .
Run the container:
docker run -d --name swathi-capstone-container -p 3000:3000 swathilakshmanan/swathi-devops-app:v1
Check running containers:
docker ps
Stop and remove the local container when required:
docker rm -f swathi-capstone-container
CI/CD Pipeline Flow
1. Checkout: Jenkins retrieves the source code from the GitHub repository.
2. Test: Jenkins runs the Node.js test suite. The latest recorded successful run completed 2 tests with 0 failures.
3. Build Docker Image: Jenkins builds the application image for the linux/amd64 platform.
4. Push to Docker Hub: Jenkins authenticates using stored credentials and pushes swathilakshmanan/swathi-devops-app:v1.
5. Deploy to AWS EC2: Jenkins connects to the Ubuntu EC2 application host using an SSH credential, pulls the image and runs the application container.
6. Backup and Cron Automation: The pipeline configures a Bash script to create compressed application log backups, removes backup archive files older than 7 days, installs the daily cron schedule, and performs an initial backup.
Deployment and Monitoring
- Application: http://15.207.88.211
- Prometheus: http://15.207.88.211:9090
- Grafana: http://15.207.88.211:3000
The application is deployed as a Docker container on AWS EC2. Prometheus and Grafana are used to monitor the EC2 environment.
Backup and Retention
The backup script stores compressed application container logs under:
/var/backups/swathi-capstone
The cron schedule runs daily at 01:00 server time. Backup archive files older than 7 days are removed. This retention cleanup applies to the backup files; it does not truncate the original Docker container logs.
Jenkins Runtime Note
For transparency, Jenkins in this implementation is running in a Docker container on the project MacBook and deploys the application to AWS EC2 over SSH. The assignment's suggested technology stack lists Jenkins on EC2; the actual runtime arrangement is documented here accurately.
Repository Contents
The repository includes the Node.js application source, Dockerfile, Jenkinsfile, package files and automated tests. Keep this README in the repository root.

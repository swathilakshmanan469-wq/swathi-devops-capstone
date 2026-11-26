# Swathi DevOps Capstone Project

## Project Overview
SkillVerse AI is a Node.js web application deployed using an end-to-end DevOps CI/CD pipeline. The project uses GitHub, Jenkins, Docker, Docker Hub, AWS EC2, Prometheus and Grafana.

## Technologies Used
- Node.js and Express.js
- Git and GitHub
- Jenkins
- Docker and Docker Hub
- AWS EC2 (Ubuntu)
- Prometheus
- Grafana
- Bash and Cron

## Application Features
- Node.js Express web application
- Home page with technology information
- Health-check endpoint: `/health`
- Docker-based deployment

## Run Locally

### Prerequisites
- Node.js and npm
- Git

### Steps

```bash
git clone https://github.com/swathilakshmanan469-wq/swathi-devops-capstone.git
cd swathi-devops-capstone
npm install
node server.js
```

Open:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

## Docker Setup

Build the Docker image:

```bash
docker build -t swathi-devops-app:v1 .
```

Run the container:

```bash
docker run -d -p 3000:3000 --name swathi-capstone swathi-devops-app:v1
```

## CI/CD Pipeline

The Jenkins pipeline performs these activities:

1. Checkout source code from GitHub.
2. Build the Docker image.
3. Push the image to Docker Hub.
4. Connect to AWS EC2 using SSH.
5. Deploy the application container.

Docker Hub image:

`swathilakshmanan/swathi-devops-app:v1`

## AWS Deployment

The application is deployed on an Ubuntu EC2 instance.

Live application:

http://15.207.88.211

## Monitoring

Prometheus is used to collect system and application monitoring metrics.

Grafana is used to visualize monitoring data through dashboards.

Prometheus:

http://15.207.88.211:9090

Grafana:

http://15.207.88.211:3000

## Project Repository

GitHub:

https://github.com/swathilakshmanan469-wq/swathi-devops-capstone

## Future Enhancements
- Automated testing in the CI/CD pipeline
- Automated backup and log-cleanup scheduling
- Jenkins webhook integration
- Improved monitoring and alerting

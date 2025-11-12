[![IaC Tool](https://img.shields.io/badge/IaC-CloudFormation-orange?logo=amazon-aws)](https://aws.amazon.com/cloudformation/)
[![Cloud Provider](https://img.shields.io/badge/Cloud-AWS-232F3E?logo=amazon-aws&logoColor=FF9900)](https://aws.amazon.com/)
[![Back-end](https://img.shields.io/badge/Backend-Node.js%20%26%20Express-448833?logo=nodedotjs)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-AWS%20RDS-527FFF?logo=amazon-aws)](https://aws.amazon.com/rds/)

#Scalable E-commerce Deployment on AWS with IaC 

## Project Overview

This project focuses on deploying a simulated **E-commerce Platform** on Amazon Web Services (**AWS**) using **Infrastructure as Code (IaC)** principles. We have leveraged **AWS CloudFormation** to build a secure, highly-available, and scalable three-tier architecture that can be deployed repeatedly and reliably.

### 🏛️ Context & Course Details

| Field | Details |
| :--- | :--- |
| **Institution** | Universidad ICESI |
| **Course** | Plataformas III (Infrastructure III) |
| **Project Members** | Andres Bueno Cardona, Jean Paul Atkinson Vidales |
| **Primary Tool** | AWS CloudFormation |

---

## 🎯 Project Goal

Our main goal was to deploy a simple e-commerce application (built with **Node.js/Express.js**) on AWS, ensuring it meets the following core requirements:

1.  **Scalability:** Implementation of an **Auto Scaling Group (ASG)** behind an **Application Load Balancer (ALB)** to handle traffic spikes.
2.  **Security:** Using a **Virtual Private Cloud (VPC)** with private subnets for application servers and the database, accessed securely via a **Bastion Host** and **Session Manager**.
3.  **Reproducibility:** Defining **all** infrastructure (Network, Compute, Database) through **CloudFormation templates**.

---

## Application Components

The deployed application includes the following basic functionalities:

* **Front-end:** HTML, CSS, and JavaScript (Client-side logic).
* **Back-end:** Node.js with Express.js, providing a **REST API**.
* **Database:** AWS **RDS** (Database Engine), ensuring persistent data storage.

---

## AWS Architecture Deployed

The infrastructure is defined in the `cloudformation/` folder and follows best practices for cloud deployments:

| Component | Purpose | AWS Service(s) |
| :--- | :--- | :--- |
| **Network** | Secure isolation and connectivity. | VPC, Subnets (Public/Private), Internet Gateway, NAT Gateway. |
| **Load Balancing** | Distributes incoming web traffic across multiple servers. | Application Load Balancer (ALB). |
| **Application Layer** | Runs the Node.js application. | EC2 Instances within an Auto Scaling Group (ASG). |
| **Database Layer** | Stores persistent application data. | AWS RDS (e.g., PostgreSQL/MySQL) in a Private Subnet. |
| **Monitoring** | Tracks performance and sends alerts. | CloudWatch (Metrics & Alarms) and SNS (Notifications). |
| **Secure Access** | Securely manages remote access to EC2. | Bastion Host, Session Manager. |



-----



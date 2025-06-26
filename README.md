# AWS-CDK-Automation-Typescript

# 🏗️ VPC CDK Project

[![AWS](https://img.shields.io/badge/AWS-CDK-orange.svg)](https://aws.amazon.com/cdk/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive AWS infrastructure project built with AWS CDK (Cloud Development Kit) in TypeScript, implementing a three-tier architecture with VPC, EC2, and RDS components following AWS best practices.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🏗️ Architecture](#️-architecture)
- [🔧 Components](#-components)
- [💰 Cost Estimation](#-cost-estimation)
- [🚀 Getting Started](#-getting-started)
- [📦 Deployment](#-deployment)
- [🔐 Security Features](#-security-features)
- [📊 Monitoring & Management](#-monitoring--management)
- [🧹 Cleanup](#-cleanup)
- [📚 Learning Resources](#-learning-resources)

## 🎯 Project Overview

This project demonstrates the implementation of a **scalable three-tier web architecture** on AWS using Infrastructure as Code (IaC) principles. The architecture includes:

- **Presentation Tier**: Public subnets for load balancers and web servers
- **Application Tier**: Private subnets for application servers (EC2 instances)
- **Data Tier**: Isolated database subnets for RDS MySQL instances

### ✨ Key Features

- 🌐 **Multi-AZ VPC** with proper subnet segmentation
- 🖥️ **EC2 instances** in private subnets for security
- 🗄️ **MySQL RDS database** in isolated subnets
- 🔒 **Security best practices** implemented throughout
- 📊 **Performance monitoring** with CloudWatch integration
- 🏷️ **Comprehensive tagging** for resource management
- 💾 **Automated backups** and disaster recovery planning

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS VPC                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │  Availability   │  │  Availability   │                 │
│  │    Zone A       │  │    Zone B       │                 │
│  │                 │  │                 │                 │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │ Public Tier     │
│  │ │   Public    │ │  │ │   Public    │ │ (Load Balancer) │
│  │ │   Subnet    │ │  │ │   Subnet    │ │                 │
│  │ └─────────────┘ │  │ └─────────────┘ │                 │
│  │                 │  │                 │                 │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │ Private Tier    │
│  │ │   Private   │ │  │ │   Private   │ │ (EC2 App        │
│  │ │   Subnet    │ │  │ │   Subnet    │ │  Servers)       │
│  │ └─────────────┘ │  │ └─────────────┘ │                 │
│  │                 │  │                 │                 │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │ Database Tier   │
│  │ │  Database   │ │  │ │  Database   │ │ (RDS MySQL)     │
│  │ │   Subnet    │ │  │ │   Subnet    │ │                 │
│  │ └─────────────┘ │  │ └─────────────┘ │                 │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### 🌐 Network Configuration

| Component | CIDR Block | Purpose | Internet Access |
|-----------|------------|---------|----------------|
| **VPC** | `10.0.0.0/16` | Main network container | N/A |
| **Public Subnets** | `10.0.1.0/24`, `10.0.2.0/24` | Load balancers, NAT gateways | ✅ Direct |
| **Private Subnets** | `10.0.3.0/24`, `10.0.4.0/24` | Application servers | 🔒 Via NAT |
| **Database Subnets** | `10.0.5.0/24`, `10.0.6.0/24` | RDS instances | ❌ Isolated |

## 🔧 Components

### 📦 Stack 1: VpcCdkProjectStack

**Purpose**: Creates the foundational network infrastructure

**Resources Created**:
- ✅ VPC with DNS resolution enabled
- ✅ Internet Gateway for public internet access
- ✅ Public subnets across 2 Availability Zones
- ✅ Private isolated subnets for applications
- ✅ Database subnets for RDS placement
- ✅ Route tables and security configurations

**Key Features**:
- **Multi-AZ deployment** for high availability
- **Proper subnet segregation** following AWS best practices
- **CIDR planning** for future scalability

### 🖥️ Stack 2: EC2Stack

**Purpose**: Deploys application servers in private subnets

**Resources Created**:
- ✅ EC2 instances in private subnets
- ✅ Security groups with restricted access
- ✅ IAM roles and policies
- ✅ Auto-scaling capabilities (if configured)

**Security Configuration**:
- **No direct internet access** (private subnet placement)
- **Controlled communication** via security groups
- **IAM role-based permissions** following least privilege principle

### 🗄️ Stack 3: RDSStack

**Purpose**: Provides managed MySQL database service

#### Database Configuration

| Setting | Value | Description |
|---------|--------|-------------|
| **Engine** | MySQL 8.0.35 | Latest stable MySQL version |
| **Instance Type** | t3.micro | Cost-effective for development |
| **Storage** | 20GB initial, 30GB max | Auto-scaling enabled |
| **Multi-AZ** | Disabled | For cost optimization (enable for production) |
| **Encryption** | Enabled | Data encryption at rest |
| **Backup Retention** | 7 days | Automated daily backups |

#### Advanced Features

- 🔐 **AWS Secrets Manager** integration for credential management
- 📊 **Performance Insights** enabled (7-day retention)
- 🔍 **Enhanced Monitoring** with 60-second intervals
- ⚙️ **Custom Parameter Group** for MySQL optimization
- 🏷️ **Comprehensive tagging** for resource management

#### Database Optimizations

```sql
-- InnoDB Buffer Pool optimized for t3.micro
innodb_buffer_pool_size = 75% of instance memory (~750MB)
```

## 💰 Cost Estimation

### Monthly Cost Breakdown (US East-1)

| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| **VPC** | Standard VPC with subnets | Free |
| **EC2** | t3.micro instances | ~$8.50/month |
| **RDS** | t3.micro MySQL | ~$15.00/month |
| **Storage** | 20GB GP2 | ~$2.00/month |
| **Data Transfer** | Minimal usage | ~$1.00/month |
| **Total** | | **~$26.50/month** |

> 💡 **Free Tier Eligible**: New AWS accounts can run this architecture within the free tier limits for 12 months!

## 🚀 Getting Started

### Prerequisites

- ✅ **AWS Account** with appropriate permissions
- ✅ **AWS CLI** configured with credentials
- ✅ **Node.js** (16.x or later)
- ✅ **AWS CDK** installed globally
- ✅ **Git** for version control

### 🛠️ Installation

1. **Clone the repository**
```bash
git clone <git@github.com:TopCoderJP/AWS-CDK-Automation-Typescript.git>
cd vpc-cdk-project
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure AWS credentials**
```bash
aws configure
# Enter your Access Key ID, Secret Access Key, Region, and Output format
```

4. **Bootstrap CDK (first time only)**
```bash
cdk bootstrap
```

### 📁 Project Structure

```
vpc-cdk-project/
├── bin/
│   └── vpc-cdk-project.ts          # Main app entry point
├── lib/
│   ├── vpc-cdk-project-stack.ts    # VPC infrastructure
│   ├── ec2-stack.ts                # EC2 instances
│   └── rds-stack.ts                # RDS database
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
└── README.md                       # This file
```

## 📦 Deployment

### Step-by-Step Deployment

1. **Validate the code**
```bash
npm run build
```

2. **Preview changes**
```bash
cdk diff
```

3. **Deploy all stacks**
```bash
cdk deploy --all
```

Or deploy individually:
```bash
cdk deploy VpcCdkProjectStack  # Deploy VPC first
cdk deploy MyEC2Stack          # Deploy EC2 instances
cdk deploy MyRDSStack          # Deploy RDS database
```

### 📋 Deployment Output

After successful deployment, you'll receive:

- 🌐 **VPC ID**: For reference in other projects
- 🔗 **RDS Endpoint**: Database connection string
- 🔑 **Secret ARN**: Database credentials location
- 🆔 **Database Identifier**: RDS instance identifier

## 🔐 Security Features

### Network Security

- 🛡️ **Private Subnets**: Application servers isolated from internet
- 🔒 **Database Isolation**: RDS in dedicated isolated subnets
- 🚪 **Security Groups**: Controlled traffic flow between tiers
- 🔐 **NACLs**: Additional network-level security (if configured)

### Data Protection

- 🔐 **Encryption at Rest**: All RDS storage encrypted
- 🔑 **Secrets Management**: Database credentials in AWS Secrets Manager
- 🔄 **Automated Rotation**: Credential rotation capabilities
- 📋 **IAM Policies**: Least privilege access controls

### Compliance Features

- 🏷️ **Resource Tagging**: For governance and cost tracking
- 📊 **CloudTrail Integration**: API call logging (if enabled)
- 🔍 **VPC Flow Logs**: Network traffic monitoring (if enabled)

## 📊 Monitoring & Management

### CloudWatch Integration

- 📈 **Performance Insights**: Database performance monitoring
- ⚠️ **CloudWatch Alarms**: Automated alerting (configurable)
- 📊 **Custom Metrics**: Application-specific monitoring
- 📝 **Log Aggregation**: Centralized logging

### Backup & Recovery

- 💾 **Automated Backups**: Daily RDS snapshots
- 🔄 **Point-in-time Recovery**: 7-day retention window
- 📦 **Manual Snapshots**: On-demand backup capability
- 🌍 **Cross-region Backup**: (Configurable for production)

## 🧹 Cleanup

### Remove All Resources

```bash
# Destroy all stacks (be careful!)
cdk destroy --all
```

### Individual Stack Removal

```bash
cdk destroy MyRDSStack         # Remove database first
cdk destroy MyEC2Stack         # Remove EC2 instances
cdk destroy VpcCdkProjectStack # Remove VPC last
```

> ⚠️ **Warning**: This will permanently delete all resources and data. Ensure you have backups if needed!

## 📚 Learning Resources

### AWS Documentation

- 📖 [AWS CDK Developer Guide](https://docs.aws.amazon.com/cdk/)
- 🌐 [VPC Best Practices](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-best-practices.html)
- 🗄️ [RDS Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)
- 🖥️ [EC2 Best Practices](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-best-practices.html)

### Architecture Patterns

- 🏗️ [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- 🔄 [Three-Tier Architecture Pattern](https://aws.amazon.com/architecture/reference-architecture-diagrams/)
- 🌐 [Multi-AZ Deployments](https://aws.amazon.com/rds/features/multi-az/)

### CDK Resources

- 💻 [CDK Patterns](https://cdkpatterns.com/)
- 🎯 [CDK Workshop](https://cdkworkshop.com/)
- 📚 [TypeScript CDK Examples](https://github.com/aws-samples/aws-cdk-examples)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


*Built with ❤️ by Topcoder using AWS CDK and TypeScript*

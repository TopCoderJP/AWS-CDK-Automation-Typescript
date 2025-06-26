import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

interface RDSStackProps extends cdk.StackProps {
  vpc: ec2.Vpc; // Required: VPC from your VpcCdkProjectStack
}

export class RDSStack extends cdk.Stack {
  public readonly database: rds.DatabaseInstance;

  constructor(scope: Construct, id: string, props: RDSStackProps) {
    super(scope, id, props);
    
    // Using the VPC passed from our VpcCdkProjectStack
    // we use the existing VPC!
    const vpc = props.vpc;

    // STEP 1: Creating RDS Subnet Group
    // Use the "Database" subnets from our existing VPC
    const dbSubnetGroup = new rds.SubnetGroup(this, 'DatabaseSubnetGroup', {
      vpc: vpc,
      description: 'Subnet group for RDS database - uses Database subnets from existing VPC',
      vpcSubnets: {
        // This targets the "Database" subnets defined in vpc-cdk-project-stack.ts
        subnetGroupName: 'Database',
      },
    });

    // STEP 2: Creating RDS Parameter Group
    const parameterGroup = new rds.ParameterGroup(this, 'DatabaseParameterGroup', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_35,
      }),
      description: 'Parameter group for MySQL 8.0 database',
      parameters: {
        // This parameter sets InnoDB buffer pool to 75% of available instance memory. 
        'innodb_buffer_pool_size': '{DBInstanceClassMemory*3/4}', // For t3.micro: ~1GB RAM → buffer pool gets ~750MB
                                                                  // Purpose: Optimizes MySQL performance by caching frequently accessed data
      },
    });

    // STEP 3: Creating RDS Instance
    this.database = new rds.DatabaseInstance(this, 'MySQLDatabase', {
      // Database Engine Configuration
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_35, // Latest MySQL 8.0
      }),
      
      // Instance Configuration
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      
      // VPC and Networking (using my existing VPC!)
      vpc: vpc,
      subnetGroup: dbSubnetGroup,
      
      // Storage Configuration
      allocatedStorage: 20, // Initial storage: 20GB
      maxAllocatedStorage: 30, // Auto-scaling limit: 30GB
      storageType: rds.StorageType.GP2, // General Purpose SSD
      storageEncrypted: true, // AWS security best practice
      
      // Security Configuration
      credentials: rds.Credentials.fromGeneratedSecret('admin', {
        secretName: 'rds-mysql-credentials',
      }),
      
      // Backup and Maintenance Configuration
      backupRetention: cdk.Duration.days(7), // 7 days backup retention
      deleteAutomatedBackups: true, // Cleans up backups when instance is deleted
      
      // High Availability and Monitoring
      multiAz: false, // Set to true for production (increases cost)
      monitoringInterval: cdk.Duration.seconds(60), // Enhanced monitoring
      enablePerformanceInsights: true, // Enable performance insights
      performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT, // 7 days free tier
      
      // Maintenance and Updates
      autoMinorVersionUpgrade: true, // Automatically apply minor version updates
      parameterGroup: parameterGroup,
      
      // Deletion Protection
      deletionProtection: false, // DISABLED for this exercise - ENABLE for production!
      
      // Removal Policy for CloudFormation
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For this exercise only - I'd use the RETAIN command for production
    });

    // Applying tags using CDK's tagging system (AFTER creating the RDS instance)
    cdk.Tags.of(this.database).add('Name', 'MySQL-RDS-Instance');
    cdk.Tags.of(this.database).add('Environment', 'Development');
    cdk.Tags.of(this.database).add('Project', 'RDS-Exercise');
    cdk.Tags.of(this.database).add('ManagedBy', 'CDK');

    // STEP 4: CloudFormation Outputs
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.database.instanceEndpoint.hostname,
      description: 'RDS MySQL instance endpoint hostname',
      exportName: 'RDS-MySQL-Endpoint',
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: this.database.instanceEndpoint.port.toString(),
      description: 'RDS MySQL instance port',
      exportName: 'RDS-MySQL-Port',
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: this.database.secret?.secretArn || 'N/A',
      description: 'ARN of the secret containing database credentials',
      exportName: 'RDS-MySQL-Secret-ARN',
    });

    new cdk.CfnOutput(this, 'DatabaseIdentifier', {
      value: this.database.instanceIdentifier,
      description: 'RDS instance identifier',
      exportName: 'RDS-MySQL-Identifier',
    });
  }
}



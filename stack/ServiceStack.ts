import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr_assets from "aws-cdk-lib/aws-ecr-assets";

import { config } from "./config";

export class ServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = `${config.project.context}-${config.project.service}`;
    const environmentProjectName = `${projectName}-${config.shortEnvironment}`;

    console.log(`You are running stack: ${props?.stackName}`);

    const vpc = new ec2.Vpc(this, `${environmentProjectName}-vpc`, {
      cidr: "10.0.0.0/16",
      maxAzs: 1,

      subnetConfiguration: [
        {
          cidrMask: 24,
          name: `${environmentProjectName}-public`,
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // add a keypair
    // const keyName = `${environmentProjectName}-keypair`;
    // const key = new ec2.KeyPair(this, keyName, {

    // const igwId = vpc.internetGatewayId;

    // Security group
    const webserverSG = new ec2.SecurityGroup(this, `${environmentProjectName}-sg`, {
      vpc,
      securityGroupName: `${environmentProjectName}-sg`,
    });

    webserverSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "allow ssh access from the world");

    webserverSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), "allow HTTP traffic from anywhere");

    // Create an EC2 instance
    new ec2.Instance(this, "Instance", {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      // https://loige.co/provision-ubuntu-ec2-with-cdk/
      // https://cloud-images.ubuntu.com/locator/ec2/
      machineImage: ec2.MachineImage.genericLinux({
        "eu-north-1": "ami-0b8d1de8e3c980297", // Ubuntu Jammy Jellyfish 22.04 LTS
      }),
      securityGroup: webserverSG,
      keyPair: ec2.KeyPair.fromKeyPairName(this, "key-pair", "Johnathan"),
    });
  }

  // 'gp3' volumes are not supported in this zone
  get availabilityZones(): string[] {
    // copenhagen
    return ["eu-north-1-cph-1a"];
  }
}

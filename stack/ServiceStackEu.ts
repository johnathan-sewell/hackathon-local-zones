import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import { config } from "./config";

export class ServiceStackEu extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = `${config.project.context}-${config.project.service}`;
    const environmentProjectName = `${projectName}-${config.shortEnvironment}`;

    console.log(`You are running stack: ${props?.stackName}`);

    // EU Frankfurt
    const vpcEu = new ec2.Vpc(this, `${environmentProjectName}-eu-vpc`, {
      cidr: "10.0.0.0/16",
      availabilityZones: ["eu-central-1a"],
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: `${environmentProjectName}-public`,
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // Security group
    const webserverEuSg = new ec2.SecurityGroup(this, `${environmentProjectName}-eu-sg`, {
      vpc: vpcEu,
      securityGroupName: `${environmentProjectName}-eu-sg`,
    });

    webserverEuSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "allow ssh access from the world");
    webserverEuSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), "allow HTTP traffic from anywhere");

    // Create an EC2 instance
    new ec2.Instance(this, "Instance-eu", {
      vpc: vpcEu,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      // https://loige.co/provision-ubuntu-ec2-with-cdk/
      // https://cloud-images.ubuntu.com/locator/ec2/
      machineImage: ec2.MachineImage.genericLinux({
        "eu-central-1": "ami-0162f0739222cca1c", // Ubuntu Jammy Jellyfish 22.04 LTS
      }),
      securityGroup: webserverEuSg,
      keyPair: ec2.KeyPair.fromKeyPairName(this, "key-pair", "Johnathan-Eu"),
    });
  }

  get availabilityZones(): string[] {
    return ["eu-central-1a"];
  }
}

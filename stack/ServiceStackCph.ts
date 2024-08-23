import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import { config } from "./config";

export class ServiceStackCph extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = `${config.project.context}-${config.project.service}`;
    const environmentProjectName = `${projectName}-${config.shortEnvironment}`;

    console.log(`You are running stack: ${props?.stackName}`);

    // https://docs.aws.amazon.com/local-zones/latest/ug/getting-started.html#getting-started-create-resources
    const vpcCph = new ec2.Vpc(this, `${environmentProjectName}-vpc`, {
      cidr: "10.0.0.0/16",
      // 'gp3' volumes are not supported in this zone
      availabilityZones: ["eu-north-1-cph-1a"],

      subnetConfiguration: [
        {
          cidrMask: 24,
          name: `${environmentProjectName}-public`,
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // Security group
    const webserverCphSg = new ec2.SecurityGroup(this, `${environmentProjectName}-sg`, {
      vpc: vpcCph,
      securityGroupName: `${environmentProjectName}-sg`,
    });

    webserverCphSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "allow ssh access from the world");
    webserverCphSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), "allow HTTP traffic from anywhere");

    // Create an EC2 instance
    new ec2.Instance(this, "Instance", {
      vpc: vpcCph,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      // https://loige.co/provision-ubuntu-ec2-with-cdk/
      // https://cloud-images.ubuntu.com/locator/ec2/
      machineImage: ec2.MachineImage.genericLinux({
        "eu-north-1": "ami-0b8d1de8e3c980297", // Ubuntu Jammy Jellyfish 22.04 LTS
      }),
      securityGroup: webserverCphSg,
      keyPair: ec2.KeyPair.fromKeyPairName(this, "key-pair", "Johnathan"),
    });
  }

  get availabilityZones(): string[] {
    return ["eu-north-1-cph-1a"];
  }
}

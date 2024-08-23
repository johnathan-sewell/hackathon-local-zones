import * as cdk from "aws-cdk-lib";
import { config } from "./config";
import { ServiceStack } from "./ServiceStack";

const app = new cdk.App();
const stackProps: cdk.StackProps = {
  tags: {
    context: config.project.context,
    service: config.project.service,
    environment: config.environment,
  },
  env: {
    account: config.aws.account,
    region: config.aws.region,
  },
};

const projectName = `${config.project.context}-${config.project.service}`; 
const environmentProjectName = `${projectName}-${config.shortEnvironment}`;

new ServiceStack(app, environmentProjectName, {
  ...stackProps,
  stackName: environmentProjectName,
});

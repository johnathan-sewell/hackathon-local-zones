import * as cdk from "aws-cdk-lib";
import { config } from "./config";
import { ServiceStackCph } from "./ServiceStackCph";
import { ServiceStackEu } from "./ServiceStackEu";

const projectName = `${config.project.context}-${config.project.service}`;
const environmentProjectName = `${projectName}-${config.shortEnvironment}`;

const app = new cdk.App();

new ServiceStackCph(app, environmentProjectName, {
  tags: {
    context: config.project.context,
    service: config.project.service,
    environment: config.environment,
  },
  env: {
    account: config.aws.account,
    region: "eu-north-1",
  },
  stackName: environmentProjectName,
});

const stackName = `${environmentProjectName}-eu`;
new ServiceStackEu(app, stackName, {
  tags: {
    context: config.project.context,
    service: config.project.service,
    environment: config.environment,
  },
  env: {
    account: config.aws.account,
    region: "eu-central-1",
  },
  stackName,
});

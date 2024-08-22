/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "hackathon-local-zones",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "eu-north-1", // Stockholm
        },
      },
    };
  },
  async run() {
    // https://sst.dev/docs/component/aws/vpc#static-get
    const vpc = sst.aws.Vpc.get("hackathon-local-zones-vpc", "vpc-02079cd50abe18930");


    

    // https://sst.dev/docs/start/aws/container
    const cluster = new sst.aws.Cluster("hackathon-local-zones-cluster", { vpc });
  
    cluster.addService("hackathon-local-zones-service", {
      public: {
        ports: [
          { listen: "80/http" },
        ],
        dev: {
          command: "node --watch index.mjs",
        },
      },
    });
  }
});

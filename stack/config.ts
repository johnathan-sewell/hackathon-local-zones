import z from "zod";

const Schema = z.object({
  ENVIRONMENT: z.enum(["development", "production"]),
  REPO_NAME: z
    .string()
    .refine((val) => val.match(/\w+(-\w+)+/), {
      message: 'Repository name must be in the form "context-service".',
    })
    .default("portal-frontend-ssr"),
  AWS_ACCOUNT: z.string().default("893397411672"),
  AWS_REGION: z.string().default("eu-north-1"), // Stockholm
  VPC_ID: z.string(),
});

const envVars = Schema.safeParse(process.env);
if (!envVars.success) {
  // eslint-disable-next-line no-console
  console.error("There is an error with your environment variables.");
  throw envVars.error;
}

export const config = {
  environment: envVars.data.ENVIRONMENT,
  shortEnvironment: envVars.data.ENVIRONMENT === "production" ? ("prod" as const) : ("dev" as const),
  repoName: envVars.data.REPO_NAME,
  project: {
    context: envVars.data.REPO_NAME.split("-")[0], // Zod Schema guarantees this will be a string separated by "-"
    service: envVars.data.REPO_NAME.split("-").slice(1).join("-"),
  },
  aws: {
    account: envVars.data.AWS_ACCOUNT,
    region: envVars.data.AWS_REGION,
  },
  vpcId: envVars.data.VPC_ID,
};

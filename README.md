# hackathon-local-zones

## How this project was created

* Init SST `pnpm dlx sst init`

* Installed express `pnpm i express`

* Added server.mjs (Start with `node .`)

* Update sst.config.ts with cluster and service. (https://sst.dev/docs/start/aws/container)

* Add a Dockerfile.

* Deploy to prod `pnpm sst deploy --stage production`
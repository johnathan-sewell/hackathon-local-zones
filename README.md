# hackathon-local-zones

## How this project was created

- Installed express `pnpm i express`

- Added server/index.mjs (Start with `node .`)

- Added CDK stack for EC2 instance

### Manual steps to prepare EC2 instance

SSH into the instance using the key pair. The key pair is created in the EC2 Dashboard.

The private key is downloaded stored on the local machine at ~/.ssh/Johnathan.pem.

The key is associated with the instance in CDK.

```sh
ssh -i "Johnathan.pem" ubuntu@ec2-96-0-24-72.eu-north-1.compute.amazonaws.com
```

Update and upgrade the system.

```sh
sudo apt update
sudo apt upgrade
```

Install Node

```sh
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Rsync the code to the instance

```sh
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'stack' --exclude '.env' \
-e "ssh -i ~/.ssh/Johnathan.pem" \
. ubuntu@ec2-96-0-24-72.eu-north-1.compute.amazonaws.com:~/app
```

```sh
sudo npm install -g pnpm
pnpm install
```

Run the server

```sh
pnpm install --production
sudo node .
```

Browse to the client page
http://96.0.24.72/

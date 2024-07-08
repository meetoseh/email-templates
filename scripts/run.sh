#!/usr/bin/env bash
source /root/.bashrc
source /root/.nvm/nvm.sh
source /home/ec2-user/config.sh
node --experimental-loader ts-node/esm src/index.ts --host 0.0.0.0 --port 80

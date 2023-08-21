#!/usr/bin/env bash
. /home/ec2-user/config.sh
npx ts-node --experimental-specifier-resolution=node --esm src/index.ts --host 0.0.0.0 --port 80

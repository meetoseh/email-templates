#!/usr/bin/env bash
. /home/ec2-user/config.sh
npx ts-node --experimental-specifier-resolution=node --esm src/index.ts --host 192.168.1.23 --port 2999

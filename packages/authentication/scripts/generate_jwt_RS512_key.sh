#!/bin/bash
cd ..;
openssl genrsa -out RS512-private.pem 4096;
openssl rsa -in RS512-private.pem -pubout -out RS512-public.pem;
cat RS512-private.pem | npx wrangler secret put RS512_PRIVATE_PEM --env production;
cat RS512-public.pem | npx wrangler secret put RS512_PUBLIC_PEM --env production;
rm RS512-private.pem;
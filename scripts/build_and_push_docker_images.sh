#!/bin/bash
cd ..
#Build and push environment
#docker build --file server/Dockerfile.env --tag blockchainit/rust-env:nightly server
#docker push blockchainit/rust-env

#Build and push cargo contract
#docker build --file server/Dockerfile.cargo-contract --tag blockchainit/cargo-contract:latest server
#docker push blockchainit/cargo-contract

#Build and push server
TAG=latest
docker build --file server/Dockerfile --tag blockchainit/ink-server:$TAG server
docker push blockchainit/ink-server

#Build and push plugin
TAG=latest
docker build --file plugin/Dockerfile --tag blockchainit/ink-plugin:$TAG plugin
docker push blockchainit/ink-plugin

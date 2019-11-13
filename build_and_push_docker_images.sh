#!/bin/bash


#Build and push environment
#docker build --file Dockerfile.env --tag blockchainit/rust-env:nightly .
#docker push blockchainit/rust-env

#Build and push cargo contract
#docker build --file Dockerfile.cargo-contract --tag blockchainit/cargo-contract:latest .
#docker push blockchainit/cargo-contract

#Build and push frontend
#$TAG = latest
#docker build --file Dockerfile --tag blockchainit/ink-frontend:$TAG .
#docker push blockchainit/ink-frontend

#Build and push backend
TAG=latest
docker build --file backend/Dockerfile --tag blockchainit/ink-backend:$TAG backend
docker push blockchainit/ink-backend
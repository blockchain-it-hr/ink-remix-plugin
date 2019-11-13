#!/bin/bash


#Build and push frontend
$TAG = latest
docker build --file Dockerfile --tag blockchainit/ink-frontend:$TAG .
docker push blockchainit/ink-frontend

#Build and push backend
$TAG = latest
docker build --file Dockerfile --tag blockchainit/ink-backend:$TAG .
docker push blockchainit/ink-backend
#!/bin/bash
set -e

if [ "$CIRCLE_BRANCH" == "develop" ]; then 
    export TAG="latest";
elif [ "$CIRCLE_BRANCH" == "master" ]; then
    export TAG="stable";
else 
    export TAG=$CIRCLE_BRANCH;
fi

echo "Building '$TAG' (on branch: $CIRCLE_BRANCH)"

# build docker image
docker build --file Dockerfile --tag blockchainit/ink-remix-plugin:$TAG .

# To remove intermediate container, uncomment the line below
# docker image prune --filter label=stage=builder -f

# push to dockerhub
docker login -u $DOCKER_USER -p $DOCKER_PASS
docker push blockchainit/ink-remix-plugin:$TAG
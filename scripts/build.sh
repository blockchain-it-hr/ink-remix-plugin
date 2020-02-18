#!/bin/bash
set -e

WS_DEVELOP_URL="wss://server.develop.ink-remix.blockchain-it.hr"
WS_STAGING_URL="wss://server.staging.ink-remix.blockchain-it.hr"
WS_PROD_URL="wss://server.staging.ink-remix.blockchain-it.hr"

function export_env {
  export TAG=$1
  export WS_BASE_URL=$2
}

if [ "$CIRCLE_BRANCH" == "develop" ]; then 
    export_env latest $WS_DEVELOP_URL
elif [ "$CIRCLE_BRANCH" == "staging" ]; then 
    export_env staging $WS_STAGING_URL
elif [ "$CIRCLE_BRANCH" == "master" ]; then
    export_env stable $WS_PROD_URL
else 
    export_env $CIRCLE_BRANCH $WS_DEVELOP_URL
fi

docker login -u $DOCKER_USER -p $DOCKER_PASS

# build server
docker build --file server/Dockerfile \
             --no-cache \
             --tag blockchainit/ink-server:$TAG server/

docker push blockchainit/ink-server:$TAG

# build plugin
docker build --file plugin/Dockerfile \
             --tag blockchainit/ink-plugin:$TAG \
             --no-cache \
             --build-arg WS_BASE_URL=$WS_BASE_URL plugin/ 

docker push blockchainit/ink-plugin:$TAG

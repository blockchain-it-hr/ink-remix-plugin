#!/bin/bash

#First install istio with
# https://istio.io/docs/setup/getting-started/

gcloud auth login

export PROJECT=ink-server
gcloud config set project $PROJECT

export MESH_ID=inkmesh
export ORG_NAME=ink-remix.blockchain-it.hr

export WORKDIR=$(pwd)/ink
mkdir -p ${WORKDIR}
cd ${WORKDIR}
export MESH_ID=inkmesh
export ORG_NAME=production.ink-remix.blockchain-it.hr

wget https://raw.githubusercontent.com/istio/istio/release-1.4/samples/multicluster/setup-mesh.sh
chmod +x setup-mesh.sh
./setup-mesh.sh prep-mesh

# Add contexts to topology.yaml

./setup-mesh.sh apply

kubectl get all --namespace istio-system

kubectl get svc istio-ingressgateway -n istio-system

kubectl label namespace default istio-injection=enabled

# If istio has external ip
export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].port}')

export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT

export INGRESSGATEWAY=istio-ingressgateway
kubectl patch svc $INGRESSGATEWAY --namespace istio-system --patch '{"spec": { "loadBalancerIP": "34.107.140.107" }}'
kubectl get svc $INGRESSGATEWAY --namespace istio-system

# This way you deploy gateway for the helm charts, in this case 
./deploy_to_multicluster.sh install


gcloud compute addresses list




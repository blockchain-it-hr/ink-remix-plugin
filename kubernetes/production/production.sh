gcloud auth login
PROJECT=ink-server
gcloud config set project $PROJECT
WORKDIR=$(pwd)
HELM_VERSION=v2.16.1
HELM_PATH="$WORKDIR"/helm-"$HELM_VERSION"
wget https://storage.googleapis.com/kubernetes-helm/helm-"$HELM_VERSION"-linux-amd64.tar.gz
tar -xvzf helm-"$HELM_VERSION"-linux-amd64.tar.gz
mv linux-amd64 "$HELM_PATH"

git clone https://github.com/ahmetb/kubectx $WORKDIR/kubectx
export PATH=$PATH:$WORKDIR/kubectx

# Create a cluster in us-east and get its credentials
gcloud container clusters create \
    --zone us-east4-a \
    --num-nodes 1 \
    --machine-type n1-standard-4 \
    --async \
    usa
# Create a cluster in eu-west and get its credentials
gcloud container clusters create \
    --zone europe-west6-a \
    --num-nodes 1 \
    --machine-type n1-standard-4 \
    --async \
    europe

# sleep 240

gcloud container clusters list

# Or get credentials of already created clusters
# KUBECONFIG=clusters.yaml gcloud container clusters \
#     get-credentials usa --zone=us-east4-a

# KUBECONFIG=clusters.yaml gcloud container clusters \
#     get-credentials europe --zone=europe-west6-a

kubectl config use-context europe
kubectl config view --minify --flatten > europe.yaml

kubectl config use-context usa
kubectl config view --minify --flatten > usa.yaml

KUBECONFIG=europe.yaml:usa.yaml kubectl config view --flatten > clusters.yaml

# Connect to both clusters
export PROJECT_ID=$(gcloud info --format='value(config.project)')
gcloud container clusters get-credentials usa --zone us-east4-a --project ${PROJECT_ID}
gcloud container clusters get-credentials europe --zone europe-west6-a --project ${PROJECT_ID}

# Renaming contexts for convenience (Optional)
kubectx usa=gke_${PROJECT_ID}_us-east4-a_usa
kubectx europe=gke_${PROJECT_ID}_europe-west6-a_europe

## Setup europe
kubectx europe

kubectl create serviceaccount tiller --namespace kube-system
kubectl create clusterrolebinding tiller-admin-binding \
    --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

${HELM_PATH}/helm init --service-account=tiller
${HELM_PATH}/helm repo update

${HELM_PATH}/helm version

## Setup usa
kubectx usa

kubectl create serviceaccount tiller --namespace kube-system
kubectl create clusterrolebinding tiller-admin-binding \
    --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

${HELM_PATH}/helm init --service-account=tiller
${HELM_PATH}/helm repo update

${HELM_PATH}/helm version

sleep 30

## Install helm chart on europe and usa clusters
kubectx europe
${HELM_PATH}/helm install --namespace ink --name ink ../ink

## Install helm chart on europe and usa clusters
kubectx usa
${HELM_PATH}/helm install --namespace ink --name ink ../ink

## Update charts if you want to update
# No need if they have been just created
# kubectx europe
# ${HELM_PATH}/helm upgrade --namespace ink ink ../ink

# kubectx usa
# ${HELM_PATH}/helm upgrade --namespace ink ink ../ink

# Reserve global ip
gcloud compute addresses create --global production-ip

#Or list if you already have one
gcloud compute addresses list

## Istio mesh 
# All configuration is done again, but if you already used previous steps feel free to skip
export WORKDIR=$(pwd)
mkdir -p ${WORKDIR}
cd ${WORKDIR}
export MESH_ID=inkmesh
export ORG_NAME=production.ink-remix.blockchain-it.hr
wget https://raw.githubusercontent.com/istio/istio/release-1.4/samples/multicluster/setup-mesh.sh
chmod +x setup-mesh.sh
#./setup-mesh.sh prep-mesh

# Add contexts to topology.yaml or renmae topology.example.yaml to topology.yaml
./setup-mesh.sh apply

# Get ingress IP of istio
kubectl get svc istio-ingressgateway -n istio-system

# Add istio-injection to both default and ink namespaces
kubectl label namespace cert-manager istio-injection=enabled
kubectl label namespace default istio-injection=enabled
kubectl label namespace ink istio-injection=enabled

# This way you deploy gateway for the helm chart
./deploy-to-multicluster.sh install

# If istio has external ip
export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].port}')

export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT
echo $GATEWAY_URL
# go to the link and see that app is working

#  Certs
kubectl create namespace cert-manager
kubectl label namespace cert-manager istio-injection=disabled --overwrite
helm repo add jetstack https://charts.jetstack.io
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.8/deploy/manifests/00-crds.yaml
helm repo update
helm install \
  --name cert-manager \
  --namespace cert-manager \
  --version v0.8.1 \
  --set ingressShim.defaultIssuerName=letsencrypt-staging \
  --set ingressShim.defaultIssuerKind=ClusterIssuer \
  --set ingressShim.defaultIssuerGroup=certmanager.k8s.io \
  jetstack/cert-manager


helm upgrade \
  cert-manager \
  --namespace cert-manager \
  --version v0.8.1 \
  --set ingressShim.defaultIssuerName=letsencrypt-staging \
  --set ingressShim.defaultIssuerKind=ClusterIssuer \
  --set ingressShim.defaultIssuerGroup=certmanager.k8s.io \
  jetstack/cert-manager

 INGRESS_DOMAIN=ink-remix.blockchain-it.hr

kubectl -n istio-system \
  patch gateway istio-autogenerated-k8s-ingress --type=json \
  -p='[{"op": "replace", "path": "/spec/servers/1/tls", "value": {"credentialName": "ingress-cert", "mode": "SIMPLE", "privateKey": "sds", "serverCertificate": "sds"}}]'


helm upgrade \
  cert-manager \
  --namespace cert-manager \
  --version v0.8.0 \
  --set ingressShim.defaultIssuerName=letsencrypt-staging \
  --set ingressShim.defaultIssuerKind=ClusterIssuer \
  jetstack/cert-manager


# Check that everything is running
kubectl get pods --namespace cert-manager

# Now test that everything is working with test resources
kubectl apply -f test-resources.yaml
kubectl describe certificate -n cert-manager-test
kubectl delete -f test-resources.yaml

kubectl describe certificate -n cert-manager

kubectl apply -f lets-encrypt.yaml

# Now onto seting up certs for https
kubectl -n istio-system get service istio-ingressgateway
INGRESS_DOMAIN=ink-remix.blockchain-it.hr

kubectl -n istio-system \
  patch gateway istio-autogenerated-k8s-ingress --type=json \
  -p='[{"op": "replace", "path": "/spec/servers/1/tls", "value": {"credentialName": "ingress-cert", "mode": "SIMPLE", "privateKey": "sds", "serverCertificate": "sds"}}]'


# Generate certificate automatically
# If you want to delete the resources

# Delete all resources
# ./deploy_to_multicluster uninstall
# ./setup-mesh.sh teardown # Clear istio and all it's resources
# kubectl -n istio-system delete secret ingress-cert --namespace cert-manager

# # Debug
# kubectl get -o yaml \
#    --all-namespaces \
#    issuer,clusterissuer,certificates,orders,challenges

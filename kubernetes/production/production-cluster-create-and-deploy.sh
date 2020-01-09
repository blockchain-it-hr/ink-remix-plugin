# Description here
# https://cloud.google.com/solutions/managing-and-deploying-apps-to-multiple-gke-clusters-using-spinnaker
# Go through this tutorial above, here are copied all the commands and naming of some stuff have been changed but the flow is the same
PROJECT_NAME=ink-server

gcloud config set project  $PROJECT_NAME

# In cloud shell
mkdir $HOME/spinnaker
cd $HOME/spinnaker
WORKDIR=$(pwd)

# Install helm
HELM_VERSION=v2.13.0
HELM_PATH="$WORKDIR"/helm-"$HELM_VERSION"
wget https://storage.googleapis.com/kubernetes-helm/helm-"$HELM_VERSION"-linux-amd64.tar.gz
tar -xvzf helm-"$HELM_VERSION"-linux-amd64.tar.gz
mv linux-amd64 "$HELM_PATH"

git clone https://github.com/ahmetb/kubectx $WORKDIR/kubectx
export PATH=$PATH:$WORKDIR/kubectx

curl -LO https://storage.googleapis.com/spinnaker-artifacts/spin/1.5.2/linux/amd64/spin
chmod +x spin

# Create clusters
gcloud container clusters create spinnaker --zone us-east4-a \
    --num-nodes 1 --machine-type n1-standard-2 --async
gcloud container clusters create usa --zone us-east4-a \
    --num-nodes 1 --machine-type n1-standard-2 --async
gcloud container clusters create europe --zone europe-west6-a \
    --num-nodes 1 --machine-type n1-standard-2

# Wait for clusters to be created
gcloud container clusters list

# Connect to all three clusters
export PROJECT_ID=$(gcloud info --format='value(config.project)')
gcloud container clusters get-credentials usa --zone us-east4-a --project ${PROJECT_ID}
gcloud container clusters get-credentials europe --zone europe-west6-a --project ${PROJECT_ID}
gcloud container clusters get-credentials spinnaker --zone us-east4-a --project ${PROJECT_ID}

# Renaming contexts for convenience (Optional)
kubectx usa=gke_${PROJECT_ID}_us-east4-a_usa
kubectx europe=gke_${PROJECT_ID}_europe-west6-a_europe
kubectx spinnaker=gke_${PROJECT_ID}_us-east4-a_spinnaker

# Give cluster-admin permissions to all three clusters
kubectl create clusterrolebinding user-admin-binding \
    --clusterrole=cluster-admin \
    --user=$(gcloud config get-value account) \
    --context spinnaker
kubectl create clusterrolebinding user-admin-binding \
    --clusterrole=cluster-admin \
    --user=$(gcloud config get-value account) \
    --context europe
kubectl create clusterrolebinding user-admin-binding \
    --clusterrole=cluster-admin \
    --user=$(gcloud config get-value account) \
    --context usa

# GCP service account to be used by Spinnaker
gcloud iam service-accounts create spinnaker --display-name spinnaker-service-account
SPINNAKER_SA_EMAIL=$(gcloud iam service-accounts list \
    --filter="displayName:spinnaker-service-account" \
    --format='value(email)')

# Bind the storage.admin and storage.objectAdmin roles to the Spinnaker service account
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --role roles/storage.admin \
    --member serviceAccount:${SPINNAKER_SA_EMAIL}
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --role roles/storage.objectAdmin \
    --member serviceAccount:${SPINNAKER_SA_EMAIL}

# Save this key
gcloud iam service-accounts keys create $WORKDIR/spinnaker-service-account.json --iam-account ${SPINNAKER_SA_EMAIL}
# It should be stored in /home/username/spinnaker/spinnaker-service-account.json or simmilar (copy it offline)

# Cloud Pub/Sub
gcloud pubsub topics create projects/${PROJECT_ID}/topics/gcr

gcloud pubsub subscriptions create gcr-triggers \
    --topic projects/${PROJECT_ID}/topics/gcr

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --role roles/pubsub.subscriber \
    --member serviceAccount:${SPINNAKER_SA_EMAIL}

# Deploy Spinnaker with Helm
kubectx spinnaker

kubectl create serviceaccount tiller --namespace kube-system
kubectl create clusterrolebinding tiller-admin-binding \
    --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

${HELM_PATH}/helm init --service-account=tiller
${HELM_PATH}/helm update

${HELM_PATH}/helm version
# Something like this should be shown
# Client: &version.Version{SemVer:"v2.13.0", GitCommit:"79d07943b03aea2b76c12644b4b54733bc5958d6", GitTreeState:"clean"}
# Server: &version.Version{SemVer:"v2.13.0", GitCommit:"79d07943b03aea2b76c12644b4b54733bc5958d6", GitTreeState:"clean"}

# Configuring Spinnaker
export PROJECT_ID=$(gcloud info --format='value(config.project)')
export BUCKET=${PROJECT_ID}-spinnaker-config
gsutil mb -c regional -l us-east4 gs://${BUCKET}


# Spinmaker config

export SA_JSON=$(cat $WORKDIR/spinnaker-service-account.json)
export PROJECT_ID=$(gcloud info --format='value(config.project)')
export BUCKET=${PROJECT_ID}-spinnaker-config

cat > spinnaker-config.yaml <<EOF
gcs:
  enabled: true
  bucket: $BUCKET
  project: $PROJECT_ID
  jsonKey: '$SA_JSON'

dockerRegistries:
- name: gcr
  address: https://gcr.io
  username: _json_key
  password: '$SA_JSON'
  email: edi.sinovcic@gmail.com

# Disable minio as the default storage backend
minio:
  enabled: false

jenkins:
  enabled: false

# Configure Spinnaker to enable GCP services
halyard:
  spinnakerVersion: 1.12.5
  image:
    tag: 1.16.0
  additionalScripts:
    create: true
    data:
      enable_gcs_artifacts.sh: |-
        \$HAL_COMMAND config artifact gcs account add gcs-$PROJECT_ID --json-path /opt/gcs/key.json
        \$HAL_COMMAND config artifact gcs enable
      enable_pubsub_triggers.sh: |-
        \$HAL_COMMAND config pubsub google enable
        \$HAL_COMMAND config pubsub google subscription add gcr-triggers \
          --subscription-name gcr-triggers \
          --json-path /opt/gcs/key.json \
          --project $PROJECT_ID \
          --message-format GCR
EOF


# Deploy chart with spinnamer

${HELM_PATH}/helm install -n spin stable/spinnaker -f spinnaker-config.yaml --timeout 600 \
--version 1.8.1 --wait

# This will take couple of minutes

# Now lets add access to other cluster to spinnmaker

cat > spinnaker-sa.yaml <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: spinnaker
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
 name: spinnaker-role
rules:
- apiGroups: [""]
  resources: ["namespaces", "configmaps", "events", "replicationcontrollers", "serviceaccounts", "pods/log"]
  verbs: ["get", "list"]
- apiGroups: [""]
  resources: ["pods", "services", "secrets"]
  verbs: ["create", "delete", "deletecollection", "get", "list", "patch", "update", "watch"]
- apiGroups: ["autoscaling"]
  resources: ["horizontalpodautoscalers"]
  verbs: ["list", "get"]
- apiGroups: ["apps"]
  resources: ["controllerrevisions", "statefulsets"]
  verbs: ["list"]
- apiGroups: ["extensions", "apps"]
  resources: ["deployments", "replicasets", "ingresses"]
  verbs: ["create", "delete", "deletecollection", "get", "list", "patch", "update", "watch"]
# These permissions are necessary for halyard to operate. We also use this role to deploy Spinnaker.
- apiGroups: [""]
  resources: ["services/proxy", "pods/portforward"]
  verbs: ["create", "delete", "deletecollection", "get", "list", "patch", "update", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
 name: spinnaker-role-binding
roleRef:
 apiGroup: rbac.authorization.k8s.io
 kind: ClusterRole
 name: spinnaker-role
subjects:
- namespace: spinnaker
  kind: ServiceAccount
  name: spinnaker-service-account
---
apiVersion: v1
kind: ServiceAccount
metadata:
 name: spinnaker-service-account
 namespace: spinnaker
EOF

kubectl --context europe apply -f spinnaker-sa.yaml
kubectl --context usa apply -f spinnaker-sa.yaml

EUROPE_CLUSTER=gke_${PROJECT_ID}_europe-west6-a_europe
USA_CLUSTER=gke_${PROJECT_ID}_us-east4-a_usa
EUROPE_USER=west-spinnaker-service-account
USA_USER=east-spinnaker-service-account

EUROPE_TOKEN=$(kubectl --context europe get secret \
    $(kubectl get serviceaccount spinnaker-service-account \
    --context europe \
    -n spinnaker \
    -o jsonpath='{.secrets[0].name}') \
    -n spinnaker \
    -o jsonpath='{.data.token}' | base64 --decode)
USA_TOKEN=$(kubectl --context usa get secret \
    $(kubectl get serviceaccount spinnaker-service-account \
    --context usa \
    -n spinnaker \
    -o jsonpath='{.secrets[0].name}') \
    -n spinnaker \
    -o jsonpath='{.data.token}' | base64 --decode)

kubectl config view --raw -o json | jq -r '.clusters[] | select(.name == "'$EUROPE_CLUSTER'") | .cluster."certificate-authority-data"' | base64 -d > europe_cluster_ca.crt
kubectl config view --raw -o json | jq -r '.clusters[] | select(.name == "'$USA_CLUSTER'") | .cluster."certificate-authority-data"' | base64 -d > usa_cluster_ca.crt

EUROPE_SERVER=$(kubectl config view --raw -o json | jq -r '.clusters[] | select(.name == "'$EUROPE_CLUSTER'") | .cluster."server"')
USA_SERVER=$(kubectl config view --raw -o json | jq -r '.clusters[] | select(.name == "'$USA_CLUSTER'") | .cluster."server"')

KUBECONFIG_FILE=spinnaker-kubeconfig

kubectl config --kubeconfig=$KUBECONFIG_FILE set-cluster $EUROPE_CLUSTER \
    --certificate-authority=$WORKDIR/europe_cluster_ca.crt \
    --embed-certs=true \
    --server $EUROPE_SERVER
kubectl config --kubeconfig=$KUBECONFIG_FILE set-credentials $EUROPE_USER --token $EUROPE_TOKEN
kubectl config --kubeconfig=$KUBECONFIG_FILE set-context europe --user $EUROPE_USER --cluster $EUROPE_CLUSTER
kubectl config --kubeconfig=$KUBECONFIG_FILE set-cluster $USA_CLUSTER \
    --certificate-authority=$WORKDIR/usa_cluster_ca.crt \
    --embed-certs=true \
    --server $USA_SERVER
kubectl config --kubeconfig=$KUBECONFIG_FILE set-credentials $USA_USER --token $USA_TOKEN
kubectl config --kubeconfig=$KUBECONFIG_FILE set-context usa --user $USA_USER --cluster $USA_CLUSTER

kubectx spinnaker
kubectl create secret generic --from-file=$WORKDIR/spinnaker-kubeconfig spin-kubeconfig

cat >> spinnaker-config.yaml <<EOF
kubeConfig:
  enabled: true
  secretName: spin-kubeconfig
  secretKey: spinnaker-kubeconfig
  contexts:
  - usa
  - europe
EOF

${HELM_PATH}/helm upgrade spin stable/spinnaker -f spinnaker-config.yaml --timeout 600 --version 1.8.1 --wait

# See that pods are running
kubectl get pods


export DECK_POD=$(kubectl get pods --namespace default -l "cluster=spin-deck" \
    -o jsonpath="{.items[0].metadata.name}")
kubectl port-forward --namespace default $DECK_POD 8080:9000 >> /dev/null &

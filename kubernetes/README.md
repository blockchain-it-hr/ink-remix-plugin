# Ink! Kubernetes charts

Here are two charts for running production ready ink! network.

## Ink-network

In the ink-network folder to deploy a network use
`sh deploy.sh`

or follow the steps bellow.

### Templates

Templates consist of backend and frontend statefullsets (which represent server and plugin dockerfiles) and service which exposes ports and networking inside cluster. There are also ingress-rules for these services that are used on Ingress for network routing and as a rules for load balancer.

## Cert

For generating certs run generate-certs.sh if you want to generate certificate with let's encrypt on Digital Ocean DNS.

Reserving static ip address can be computed using reserve-static-ip.sh.

## Flow of the process

### Prerequisites

* Minikube or your GKE/AKS/EKS cluster
* Helm (https://helm.sh/docs/intro/install/)
* Tiller

### Configure default values

Update values in values.yaml file to your requirements (can be used as is)

#### Running in minikube

Start minikube with default values.

```bash
minkube start
```

Once it's finished you can proceed to next step.

### Running in any kubernetes provider

#### Run helm and install the chart

```bash
helm install --namespace ink --name ink .
```

Once it finishes you can open dashboard on your cloud provider or with minikube use:

```bash
minikube dashboard &
```

#### Upgrade

```bash
helm upgrade ink .
```

#### Delete

If you want to delete just run

```bash
helm del --purge ink
```

### Running in Kubernetes
For running in single cluster go to single_cluster_deployment.sh

For running multicluster deployments setup mesh and then install helm chart for both clusters (production.sh)

#### Troubleshooting

If you are missing Tiller just run:

```bash
helm init
```

Hacky solution for tiller problems:

```bash
kubectl --namespace kube-system create serviceaccount tiller

kubectl create clusterrolebinding tiller-cluster-rule \
 --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

kubectl --namespace kube-system patch deploy tiller-deploy \
 -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'
```

https://github.com/helm/helm/issues/3130

### Installing Ingress

```bash
helm install stable/nginx-ingress --namespace ink --name ink-ingress --set controller.replicaCount=2 --set rbac.create=true
```

#### Apply the rules

```bash
kubectl apply -f ingress-rules.yaml
```

#!/usr/bin/env bash
helm repo add jetstack https://charts.jetstack.io
kubectl create namespace cert-manager
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.8/deploy/manifests/00-crds.yaml

helm install --namespace default --name cert .

#kubectl apply -f digitalocean-dns-secret.yaml

#kubectl apply -f certificate.yaml 

helm install --name cert-manager --namespace cert-manager --version v0.8.1 jetstack/cert-manager \
   --set ingressShim.defaultIssuerName=letsencrypt-prod \
   --set ingressShim.defaultIssuerKind=ClusterIssuer

#kubectl apply -f tls/issuer.yaml

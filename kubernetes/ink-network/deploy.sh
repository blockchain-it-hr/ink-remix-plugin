
helm install --namespace ink --name ink .
helm install stable/nginx-ingress --namespace ink --name ink-ingress --set controller.replicaCount=2 --set rbac.create=true

istioctl manifest apply

export PILOT_POD_IP=$(kubectl -n istio-system get pod -l istio=pilot -o jsonpath='{.items[0].status.podIP}')
export POLICY_POD_IP=$(kubectl -n istio-system get pod -l istio-mixer-type=policy -o jsonpath='{.items[0].status.podIP}')
export TELEMETRY_POD_IP=$(kubectl -n istio-system get pod -l istio-mixer-type=telemetry -o jsonpath='{.items[0].status.podIP}')

istioctl manifest apply \
--set profile=remote \
--set values.global.controlPlaneSecurityEnabled=false \
--set values.global.createRemoteSvcEndpoints=true \
--set values.global.remotePilotCreateSvcEndpoint=true \
--set values.global.remotePilotAddress=${PILOT_POD_IP} \
--set values.global.remotePolicyAddress=${POLICY_POD_IP} \
--set values.global.remoteTelemetryAddress=${TELEMETRY_POD_IP} \
--set gateways.enabled=false \
--set autoInjection.enabled=true

kubectl label namespace default istio-injection=enabled

export WORK_DIR=$(pwd)
CLUSTER_NAME=$(kubectl config view --minify=true -o jsonpath='{.clusters[].name}')
export KUBECFG_FILE=${WORK_DIR}/${CLUSTER_NAME}
SERVER=$(kubectl config view --minify=true -o jsonpath='{.clusters[].cluster.server}')
NAMESPACE=istio-system
SERVICE_ACCOUNT=istio-reader-service-account
SECRET_NAME=$(kubectl get sa ${SERVICE_ACCOUNT} -n ${NAMESPACE} -o jsonpath='{.secrets[].name}')
CA_DATA=$(kubectl get secret ${SECRET_NAME} -n ${NAMESPACE} -o jsonpath="{.data['ca\.crt']}")
TOKEN=$(kubectl get secret ${SECRET_NAME} -n ${NAMESPACE} -o jsonpath="{.data['token']}" | base64 --decode)

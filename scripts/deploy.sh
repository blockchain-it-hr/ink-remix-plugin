curl -XPOST \
  [https://api.github.com/repos/blockchain-it-hr/ink-remix-plugin/deployments](https://api.github.com/repos/blockchain-it-hr/ink-remix-plugin/deployments) \
  -d '{
  "required_contexts": ["build"],
  "ref": "feature-kubernetes-ci",
  "environment": "staging",
  "description": "Staging",
  "payload": {
    "value_files": ["./config/staging.yml", "./config/_common.yml"],
    "release": "staging-ink",
    "namespace": "ink",
    "track": "stable",
    "values": {"replicaCount": 1,"version": "v1"}
  }
}'

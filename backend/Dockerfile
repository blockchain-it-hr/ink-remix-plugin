FROM blockchainit/ink-backend:latest

ARG WORKSPACE_DIR=/usr/src/app
WORKDIR ${WORKSPACE_DIR}

COPY . ${WORKSPACE_DIR}

EXPOSE 65520
CMD ["npm", "run", "serve"]
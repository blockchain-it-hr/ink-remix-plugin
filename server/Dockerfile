FROM blockchainit/cargo-contract:latest

ARG WORKSPACE_DIR=/usr/src/app
WORKDIR ${WORKSPACE_DIR}

COPY . ${WORKSPACE_DIR}
RUN npm install

EXPOSE 65520
CMD ["npm", "run", "start"]
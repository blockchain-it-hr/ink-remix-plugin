FROM blockchainit/cargo-contract:latest

ARG WORKSPACE_DIR=/home/app/user
WORKDIR ${WORKSPACE_DIR}

COPY . ${WORKSPACE_DIR}
RUN cd ${WORKSPACE_DIR} && npm install

EXPOSE 65520
CMD ["npm", "run", "start"]

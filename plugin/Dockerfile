FROM node:10 as build

ARG WORKSPACE_DIR=/usr/src/app
WORKDIR ${WORKSPACE_DIR}

COPY . .

RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm run build

FROM node:10-alpine
ARG WORKSPACE_DIR=/usr/src/app

COPY --from=build ${WORKSPACE_DIR}/dist ${WORKSPACE_DIR}/dist
COPY --from=build ${WORKSPACE_DIR}/package.json ${WORKSPACE_DIR}/package.json 

EXPOSE 3000
CMD ["npm", "run", "serve"]
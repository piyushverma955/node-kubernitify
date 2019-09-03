var e = {};

e.dockerFile = (port) =>{
    return `FROM node:10-alpine
WORKDIR /app
COPY package.json /app
COPY . /app
RUN npm install --production
EXPOSE ${port}
CMD node app.js`;
}

e.kubernetesYaml = (config) => {
    return `apiVersion: v1
kind: Service
metadata:
  name: ${config.appName}
  namespace: ${config.namespace}
spec:
  type: LoadBalancer
  selector:
    app: ${config.appName}
  ports:
    - protocol: TCP
      port: ${config.externalPort}
      nodePort:  ${config.externalPort}
      targetPort: ${config.internalPort}
---
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: ${config.appName}
  namespace: ${config.namespace}
spec:
  replicas: ${config.podCount}
  selector:
    matchLabels:
      app: ${config.appName}
  template:
    metadata:
      labels:
        app: ${config.appName}
    spec:
      containers:
        - name: ${config.appName}
          image: ${config.imageName}
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: ${config.internalPort}
    `
}
module.exports = e;
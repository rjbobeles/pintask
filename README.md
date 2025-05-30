# Job Application Web / Mobile Development Task

## Table of Contents

- [Decisions Made](#decisions-made)
- [Software Requirements](#software-requirements)
- [Running the Services](#running-the-services)
- [Container Building](#container-building)
- [Generating JWT Tokens](#generating-jwt)
- [Port Mapping](#port-mapping)
- [Generate Command](#generate-command)

## Decisions Made

## Software Requirements

- Docker Desktop (optional: with K8s; or Minikube)
- MongoDB Compass
- NodeJS (v22+)
- [Tilt](https://tilt.dev)
- VSCode (With the recommended extensions installed)

## Running the Services

1. Duplicate the `.env.sample` file located in the root directory and provide the necessary values.
2. Run `tilt up` to start the services on your local machine.

   - **`tilt up`**: Runs the services locally; MongoDB using docker-compose
   - **`tilt up -- --compose=k8s`**: Runs all services in kubernetes; MongoDB using docker-compose
   - **`tilt up -- --compose=all`**: Runs all services in Docker Compose.

## Container building

In scenarios where a local container image registry is required, it is advised you run a local registry instance for docker `docker run -d -p 4300:5000 --name Registry registry:latest` to prevent incurring additional costs. In minikube's context, you can choose to build the image directly by assuming the docker-env in minikube. Rn ` eval $(minikube docker-env)` before building. No need to push the image.

For building the images for the different services, run the following on the root directory of the repo.

### Api Main:

- Run: `docker build -t pintask-api-main:latest -f ./docker/DockerFile.api-main .`
- Local Registry:
  - Run: `docker tag pintask-api-main:latest localhost:4300/pintask-api-main:latest`
  - Run: `docker push localhost:4300/pintask-api-main:latest`

### App Main:

- Run: `docker build -t pintask-app-main:latest -f ./docker/DockerFile.app-main .`
- Local Registry:
  - Run: `docker tag pintask-app-main:latest localhost:4300/pintask-app-main:latest`
  - Run: `docker push localhost:4300/pintask-app-main:latest`

## Generating JWT

Run this script to generate keys for JWT authentication. Note that keys for access tokens and refresh tokens _MUST_ be different.

`ssh-keygen -t rsa -b 4096 -m PEM -E SHA256 -f jwtRS256.key -N "" && openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub && cat jwtRS256.key | base64 && cat jwtRS256.key.pub | base64 && rm jwtRS256.key jwtRS256.key.pub`

## Port Mapping

| Location | Name | HTTP port |
| -------- | ---- | --------- |
| Api      | Main | 4000      |
| App      | Main | 3000      |

## Generate Command

| Location | Name         | Command                                                                                                                                                                                    |
| -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Api      | api-main     | `yarn nx generate @nx/express:application --directory=packages/api-main --linter=eslint --name=api-main --swcJest=true --unitTestRunner=jest --no-interactive `                            |
| App      | app-main     | `yarn nx generate @nx/react:application --directory=packages/app-main --linter=eslint --name=app-main --unitTestRunner=jest --compiler=swc --minimal=true --routing=true --no-interactive` |
| App      | app-main-e2e | provided by app-main                                                                                                                                                                       |

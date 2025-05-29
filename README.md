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

- Docker (with K8s; or Minikube)
- MongoDB Compass
- NodeJS
- [Tilt](https://tilt.dev)
- VSCode (With the recommended extensions installed)

## Running the Services

1. Duplicate the `.env.sample` file located in the root directory and provide the necessary values.
2. Run `tilt up` to start the services on your local machine.

   - **`tilt up`**: Runs the services locally; MongoDB using docker-compose
   - **`tilt up -- --compose=k8s`**: Runs all services in kubernetes; MongoDB using docker-compose
   - **`tilt up -- --compose=all`**: Runs all services in Docker Compose.

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

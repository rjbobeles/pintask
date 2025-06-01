# Job Application Web / Mobile Development Task

## Table of Contents

- [Introduction](#introduction)
- [Decisions Made](#decisions-made)
- [Software Requirements](#software-requirements)
- [Running the Services](#running-the-services)
- [Container Building](#container-building)
- [Generating JWT Tokens](#generating-jwt)
- [Port Mapping](#port-mapping)
- [Generate Command](#generate-command)

## Introduction

PinTask is a prototype application for managing your tasks. This prototype includes the user management, session management and task management. This fullstack application was built on MongoDB, React, Express.js, Node.js (MERN).

## Decisions Made

As this is a pre-requisite to a job application, some decisions in the implementation has to be explained.

### Bruno

Bruno serves as an API testing platform comparable to Postman's functionality. Its standout advantage lies in git integration, enabling version-controlled API documentation that can be easily distributed among team members for immediate endpoint testing. While Swagger could serve as an alternative free solution, Bruno's git-native approach offers superior collaboration workflows.

### Nx

Nx provides monorepo orchestration capabilities for this codebase. Combined with yarn, it establishes predictable project structure and dependency management patterns. The toolchain includes automated release workflows that handle simultaneous versioning across multiple packages and coordinate tagging operations for components like `api` and `app` modules.

### Tilt

Tilt typically handles local Kubernetes orchestration, though here it automates the startup sequence for APIs and supporting services. This abstraction removes configuration complexity for developers and enables multiple deployment approaches: direct CLI execution, docker-compose environments, and Kubernetes clusters.

### Unit Testing

Unit testing remains a critical component for application reliability. Given project scope and timeline constraints, the current test suite primarily demonstrates implementation patterns while providing a foundation for broader coverage expansion. Automated testing pipelines execute on pull request creation, validating both API and application layers. Reference implementations can be found in [this successful build](https://github.com/rjbobeles/pintask/pull/14) and [this intentionally failing example](https://github.com/rjbobeles/pintask/pull/13), illustrating both positive and negative test scenarios.

## Software Requirements

- [Bruno](https://www.usebruno.com) (REST Documentation)
- Docker Desktop (optional: with K8s; or Minikube)
- MongoDB Compass
- NodeJS (v22+)
- [Tilt](https://tilt.dev)
- VSCode (With the recommended extensions installed)
- Yarn

## Running the Services

1. Comply with the software requirements.
2. Clone the repository
3. Copy the `.env.sample` file located in the root directory and provide the necessary values.
4. Run `tilt up` to start the services on your local machine.

   - **`tilt up`**: Runs the services locally; MongoDB using docker-compose
   - **`tilt up -- --compose=k8s`**: Runs all services in kubernetes; MongoDB using docker-compose
   - **`tilt up -- --compose=all`**: Runs all services in Docker Compose.

## Accessing the API documentation

1. Open the bruno folder in the bruno application
2. Endpoints are arranged per module and per function
3. On the upper right, select the `Local` environment
4. Run `User > Authentication > Sign Up` to register OR Run `User > Authentication > Sign In` to login
5. Run `User > Session > Refresh Session` to refresh your tokens
6. Run other endpoints in the collection

Bruno is a Postman alternative that offers several key advantages. Unlike Postman, Bruno is free to use without paywalls and provides built-in version control for your API endpoints. A particularly convenient feature is its automatic token management - when you make requests to authentication endpoints like signing in, signing up, and refreshing session, Bruno automatically extracts and sets the tokens for you, eliminating the need for manual token handling in the documentation.

## Container building

In scenarios where a local container image registry is required, it is advised you run a local registry instance for docker `docker run -d -p 4300:5000 --name Registry registry:latest` to prevent incurring additional costs. In minikube's context, you can choose to build the image directly by assuming the docker-env in minikube. Run ` eval $(minikube docker-env)` before building. No need to push the image.

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

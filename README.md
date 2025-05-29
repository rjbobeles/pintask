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

- Docker
- MongoDB Compass
- NodeJS
- Tilt
- VSCode (With the recommended extensions installed)

## Running the Services

There are two ways to run the monorepo: manually or using Tilt. The manual method and tilt without `--compose=all` allows you to develop with breakpoints. Do note that manual setup is required for the manual method and is not recommended for use.

### Method 1: Manual

1. Create the `.env` file in each service's directory and provide the necessary values.
2. Use the NX console to launch all services manually.

### Method 2: Tilt

1. Duplicate the `.env.sample` file located in the root directory and provide the necessary values.
2. Run `tilt up` to start the services on your local machine.

   - **`tilt up`**: Runs the services locally, excluding MongoDB.
   - **`tilt up -- --compose=k8s`**: Runs all services in kubernetes
   - **`tilt up -- --compose=all`**: Runs all services, in Docker Compose.

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

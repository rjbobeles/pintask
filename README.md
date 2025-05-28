# Globe Web / Mobile Development Task

## Table of Contents

- [Introduction](#introduction)
- [Software Requirements](#software-requirements)
- [Running the Services](#running-the-services)
- [Container Building](#container-building)
- [Generating JWT Tokens](#generating-jwt)
- [Port Mapping](#port-mapping)
- [Generate Command](#generate-command)

## Software Requirements

- Docker
- MongoDB Compass
- NodeJS
- Tilt
- VSCode (With the recommended extensions installed)

## Port Mapping

## Generate Command

| Location | Name         | Command                                                                                                                                                                                                          |
| -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Api      | api-main     | `yarn nx generate @nx/express:application --directory=packages/api-main --linter=eslint --name=api-main --swcJest=true --unitTestRunner=jest --no-interactive `                                                  |
| App      | app-main     | `yarn nx generate @nx/react:application --directory=packages/app-main --linter=eslint --name=app-main --unitTestRunner=jest --compiler=swc --minimal=true --routing=true --useReactRouter=true --no-interactive` |
| App      | app-main-e2e | provided by app-main                                                                                                                                                                                             |

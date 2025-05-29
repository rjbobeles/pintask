import * as path from 'path'

import consola from 'consola'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { generalConfig } from './config/generalConfig'
import { ErrorCodes } from './constants'
import { HttpExceptionHandler } from './middleware'
import { router } from './routes'
import { initialize_mongoose_connection } from './schema'
import { HttpException } from './utils'

const createServer = async () => {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', 1)
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: false }))
  app.use(cors(generalConfig.cors))
  app.use(helmet(generalConfig.helmet))
  app.use(morgan('dev', { skip: (req) => req.url === '/health' }))

  app.use('/assets', express.static(path.join(__dirname, 'assets')))
  app.get('/health', (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        code: res.statusCode,
        name: generalConfig.name,
        environment: generalConfig.environment_name,
        message: 'Service is running perfectly!',
      })
    } catch (err) {
      next(err)
    }
  })

  app.use('/api', router)
  app.use((req, res, next) => next(new HttpException(404, 'Not Found', 'The requested resource was not found.', ErrorCodes.RESOURCE_NOT_FOUND)))
  app.use(HttpExceptionHandler)

  // Initialize Database Connection
  await initialize_mongoose_connection()

  app.listen(generalConfig.port, () => {
    consola.ready({
      message: `🚀 Server listening on port ${generalConfig.port}! [Name: ${generalConfig.name} | Environment: ${generalConfig.environment_name}]`,
      badge: true,
    })
  })

  return { app }
}

export default createServer()

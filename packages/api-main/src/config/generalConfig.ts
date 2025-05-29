import { CorsOptions } from 'cors'
import { HelmetOptions } from 'helmet'

interface GeneralConfig {
  name: string
  environment_name: string
  port: number
  cors: CorsOptions
  helmet: HelmetOptions
}

export const generalConfig: GeneralConfig = {
  name: process.env.NAME ? process.env.NAME : 'API Main',
  environment_name: process.env.ENVIRONMENT_NAME ? process.env.ENVIRONMENT_NAME : 'development',
  port: 4000,
  cors: {},
  helmet: {},
}

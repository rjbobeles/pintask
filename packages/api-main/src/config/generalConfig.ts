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
  name: 'API Main',
  environment_name: 'development',
  port: 4000,
  cors: {},
  helmet: {},
}

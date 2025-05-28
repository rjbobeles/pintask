import { CorsOptions } from 'cors'
import { HelmetOptions } from 'helmet'
import { Options as HppOptions } from 'hpp'

interface GeneralConfig {
  name: string
  environment_name: string
  port: number
  cors: CorsOptions
  helmet: HelmetOptions
  hpp: HppOptions
}

export const generalConfig: GeneralConfig = {
  name: 'API Main',
  environment_name: 'development',
  port: 4000,
  cors: {},
  helmet: {},
  hpp: {
    checkBody: true,
    checkQuery: true,
    whitelist: [],
  },
}

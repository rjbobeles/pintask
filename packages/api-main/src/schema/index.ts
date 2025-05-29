import consola from 'consola'
import mongoose from 'mongoose'

export { User } from './user.schema'
export { UserSession, type UserAgentData, type UserSessionData } from './user_session.schema'

import { databaseConfig } from '../config/databaseConfig'

export const initialize_mongoose_connection = async () => {
  try {
    await mongoose.connect(databaseConfig.database_connection_string, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 300000,
      maxPoolSize: 10,
      retryWrites: true,
      heartbeatFrequencyMS: 30000,
    })

    consola.success('MongoDB connected')
  } catch (error) {
    consola.error('MongoDB connection error:', error)
  }
}

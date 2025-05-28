interface DatabaseConfig {
  database_connection_string: string
}

export const databaseConfig: DatabaseConfig = {
  database_connection_string: process.env.MONGO_CONNECTION_STRING ? process.env.MONGO_CONNECTION_STRING : 'mongodb://localhost:27017/api-main',
}

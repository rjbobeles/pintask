import { UserData, UserSessionData } from '../../schema'

export {}

declare global {
  namespace Express {
    interface Request {
      user: {
        data: UserData
        session: UserSessionData
      }
    }
  }
}

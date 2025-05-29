import jwt from 'jsonwebtoken'

import { jwtConfig } from '../../../config/jwtConfig'
import { ErrorCodes } from '../../../constants'
import { UserSession, UserSessionData } from '../../../schema'
import { HttpException } from '../../../utils'

export const sign_tokens = async (session: UserSessionData): Promise<{ access_token: string; refresh_token: string }> => {
  const refresh_token = jwt.sign(
    {
      _id: session._userId,
      _sessionId: session._id,
      sub: session._userId,
      nonce: session.nonce,
    },
    jwtConfig.jwt_private_refresh_key,
    { expiresIn: '15m', algorithm: 'RS256' },
  )

  const refresh_decoded = jwt.decode(refresh_token, { json: true })
  if (!refresh_decoded || !refresh_decoded.exp) throw new HttpException(500, 'Failed to decode token', undefined, ErrorCodes.SESSION_CREATION_FAILED)

  const updateAck = await UserSession.updateOne({ _id: session._id }, { $set: { expires_at: new Date(refresh_decoded.exp * 1000) } })
  if (!updateAck.acknowledged || updateAck.modifiedCount === 0)
    throw new HttpException(500, 'Failed to update session', undefined, ErrorCodes.SESSION_CREATION_FAILED)

  const access_token = jwt.sign(
    {
      _id: session._userId,
      _sessionId: session._id,
      nonce: session.nonce,
      sub: session._userId,
    },
    jwtConfig.jwt_private_access_key,
    { expiresIn: '7d', algorithm: 'RS256' },
  )

  return { access_token, refresh_token }
}

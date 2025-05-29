import crypto from 'crypto'

import { Types } from 'mongoose'

import { sign_tokens } from '.'

import { User, UserAgentData, UserSession, UserSessionData } from '../../../schema'

export const create_session = async (
  device_id: string,
  ip_address: string,
  user_id: Types.ObjectId,
  user_agent: UserAgentData | null = null,
): Promise<{ session: UserSessionData; tokens: { access_token: string; refresh_token: string } } | null> => {
  const user = await User.find({ _id: user_id }).select('user').lean()
  if (!user) return null

  const session = await UserSession.create({
    _userId: new Types.ObjectId(user_id),
    device_id,
    nonce: crypto.randomBytes(30).toString('hex'),
    ip_address,
    user_agent,
    last_used_at: new Date(),
    invalidated_at: null,
    expires_at: new Date((Math.floor(Date.now() / 1000) + 24 * 60 * 60) * 1000),
    created_at: new Date(),
    updated_at: new Date(),
  })

  return { session, tokens: await sign_tokens(session) }
}

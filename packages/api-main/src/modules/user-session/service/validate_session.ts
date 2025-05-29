import { Types } from 'mongoose'

import { UserSession, UserSessionData } from '../../../schema'

export const validate_session = async (
  user_id: Types.ObjectId,
  session_id: Types.ObjectId,
  nonce: string,
): Promise<{ session: UserSessionData } | null> => {
  const session = await UserSession.findOne({
    _id: new Types.ObjectId(session_id),
    _userId: new Types.ObjectId(user_id),
    nonce: nonce,
    expires_at: { $gt: new Date() },
    $or: [{ invalidated_at: { $exists: false } }, { invalidated_at: undefined }],
  })
  if (!session) return null

  return { session }
}

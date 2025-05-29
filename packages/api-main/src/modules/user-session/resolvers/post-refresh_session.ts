import crypto from 'crypto'

import { NextFunction, Request, Response } from 'express'

import { ErrorCodes } from '../../../constants'
import { UserSession } from '../../../schema'
import { HttpException } from '../../../utils'
import { sign_tokens } from '../service'

export const RefreshSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUpdateAck = await UserSession.updateOne(
      {
        _userId: req.user.data._id,
        _id: req.user.session._id,
        device_id: req.headers['device_id'],
        expires_at: { $gt: new Date() },
        $or: [{ invalidated_at: { $exists: false } }, { invalidated_at: undefined }],
      },
      {
        $set: {
          nonce: crypto.randomBytes(30).toString('hex'),
          ip_address: req.ip === '::1' ? '127.0.0.1' : (req.ip as string),
          last_used_at: new Date(),
          expires_at: new Date((Math.floor(Date.now() / 1000) + 24 * 60 * 60) * 1000),
          updated_at: new Date(),
        },
      },
    )
    if (sessionUpdateAck.modifiedCount !== 1) throw new HttpException(500, 'Session update failed', undefined, ErrorCodes.INTERNAL_SERVER_ERROR)

    const session = await UserSession.findById(req.user.session._id)
    if (!session) throw new HttpException(500, 'Session lookup failed', undefined, ErrorCodes.INTERNAL_SERVER_ERROR)

    res.json({
      message: 'You have successfully refreshed your tokens',
      user: {
        _id: req.user.data._id,
        first_name: req.user.data.first_name,
        last_name: req.user.data.last_name,
      },
      tokens: await sign_tokens(session),
    })
  } catch (error) {
    next(error)
  }
}

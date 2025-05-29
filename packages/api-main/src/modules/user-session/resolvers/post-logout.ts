import { NextFunction, Request, Response } from 'express'

import { ErrorCodes } from '../../../constants'
import { UserSession } from '../../../schema'
import { HttpException } from '../../../utils'

export const LogoutSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateAck = await UserSession.updateOne(
      { _id: req.user.session._id, _userId: req.user.data._id },
      { $set: { invalidated_at: new Date(), updated_at: new Date() } },
    )
    if (updateAck.modifiedCount !== 1) throw new HttpException(500, 'Session invalidation failed', undefined, ErrorCodes.INTERNAL_SERVER_ERROR)

    res.send({
      status_code: 200,
      message: 'You have successfully logged out!',
    })
  } catch (error) {
    next(error)
  }
}

import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'

import { ErrorCodes } from '../../../constants'
import { UserSession } from '../../../schema'
import { HttpException, validateSchema } from '../../../utils'

export const RevokeSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = await validateSchema(
      {
        session_id: {
          in: ['params'],
          notEmpty: { errorMessage: 'Session ID cannot be empty' },
          isString: { errorMessage: 'Session ID must be a string' },
          isMongoId: { errorMessage: 'Session ID must be a valid BSON ObjectId' },
          custom: {
            options: (value: string, { req }: { req: Request }) => {
              if (req.user.session._id.toString() === value) throw new Error('You cannot invalidate your current session')
              return true
            },
          },
        },
      },
      req,
    )
    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)

    const updateAck = await UserSession.updateOne(
      { _id: new Types.ObjectId(req.params.session_id), _userId: req.user.data._id },
      { $set: { invalidated_at: new Date(), updated_at: new Date() } },
    )
    if (updateAck.modifiedCount !== 1) throw new HttpException(500, 'Session invalidation failed', undefined, ErrorCodes.INTERNAL_SERVER_ERROR)

    res.json({
      message: 'Successfully revoked session!',
    })
  } catch (error) {
    next(error)
  }
}

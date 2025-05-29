import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'

import { ErrorCodes } from '../../../constants'
import { User } from '../../../schema'
import { computeUserAgent, HttpException, validateSchema } from '../../../utils'
import { create_session } from '../../user-session/service'

export const SignIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = await validateSchema(
      {
        email: {
          in: ['body'],
          notEmpty: { errorMessage: 'Email cannot be empty' },
          isString: { errorMessage: 'Email needs to be a string' },
          isEmail: { errorMessage: 'Email must be a valid email address' },
        },
        password: {
          in: ['body'],
          notEmpty: { errorMessage: 'Password cannot be empty' },
          isString: { errorMessage: 'Password needs to be a string' },
        },
      },
      req,
    )
    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)

    const userAgent = req.headers['user-agent'] ? computeUserAgent(req.headers['user-agent']) : null

    const user = await User.findOne({ email: req.body.email })
    if (!user) throw new HttpException(404, 'Account not found. Are you trying to sign up?', undefined, ErrorCodes.ACCOUNT_NOT_FOUND)

    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)
    if (!isPasswordValid) throw new HttpException(401, 'Invalid credentials', undefined, ErrorCodes.ACCOUNT_CREDENTIALS_INVALID)

    const session = await create_session(
      req.headers['device_id'] as string,
      req.ip === '::1' ? '127.0.0.1' : (req.ip as string),
      user._id as Types.ObjectId,
      userAgent,
    )
    if (!session) throw new HttpException(500, 'Failed to create user session', undefined, ErrorCodes.SESSION_CREATION_FAILED)

    res.json({
      message: 'You have successfully signed in',
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      tokens: session.tokens,
    })
  } catch (error) {
    next(error)
  }
}

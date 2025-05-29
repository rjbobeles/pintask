import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'

import { ErrorCodes } from '../../../constants'
import { User } from '../../../schema'
import { computeUserAgent, HttpException, validateSchema } from '../../../utils'
import { create_session } from '../../user-session/service'

export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
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
          isStrongPassword: {
            options: {
              minLength: 8,
              minLowercase: 1,
              minNumbers: 1,
              minSymbols: 1,
              minUppercase: 1,
            },
            errorMessage:
              'Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character',
          },
        },
        first_name: {
          in: ['body'],
          notEmpty: { errorMessage: 'First name cannot be empty' },
          isString: { errorMessage: 'First name needs to be a string' },
          matches: {
            options: '^[A-Za-z\\s]+$',
            errorMessage: 'First name can only contain letters and spaces',
          },
        },
        last_name: {
          in: ['body'],
          notEmpty: { errorMessage: 'Last name cannot be empty' },
          isString: { errorMessage: 'Last name needs to be a string' },
          matches: {
            options: '^[A-Za-z\\s]+$',
            errorMessage: 'Last name can only contain letters and spaces',
          },
        },
      },
      req,
    )
    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)

    const userAgent = req.headers['user-agent'] ? computeUserAgent(req.headers['user-agent']) : null

    const user = await User.findOne({ email: req.body.email })
    if (user) throw new HttpException(400, 'Account already exists. Are you trying to sign in?', undefined, ErrorCodes.ACCOUNT_ALREADY_EXISTS)

    const userAck = await User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      created_at: new Date(),
      updated_at: new Date(),
    }).catch((error) => {
      throw new HttpException(500, 'Unable to create account', error, ErrorCodes.ACCOUNT_CREATION_FAILED)
    })

    const session = await create_session(
      req.headers['device_id'] as string,
      req.ip === '::1' ? '127.0.0.1' : (req.ip as string),
      userAck._id as Types.ObjectId,
      userAgent,
    )
    if (!session) throw new HttpException(500, 'Failed to create user session', undefined, ErrorCodes.SESSION_CREATION_FAILED)

    res.json({
      message: 'You have successfully signed up',
      user: {
        _id: userAck._id,
        first_name: userAck.first_name,
        last_name: userAck.last_name,
      },
      tokens: session.tokens,
    })
  } catch (error) {
    next(error)
  }
}

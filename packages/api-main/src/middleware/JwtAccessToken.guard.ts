import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

import { jwtConfig } from '../config/jwtConfig'
import { ErrorCodes } from '../constants'
import { validate_session } from '../modules/user-session/service'
import { User } from '../schema'
import { HttpException, validateSchema } from '../utils'

export const JwtAccessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = await validateSchema(
      {
        authorization: {
          in: ['headers'],
          notEmpty: { errorMessage: 'Authorization header is required' },
          isString: { errorMessage: 'Authorization header must be a string' },
          matches: {
            options: [/^Bearer\s+\S+$/],
            errorMessage: 'Authorization header must be a valid Bearer token format',
          },
          customSanitizer: {
            options: (value: string) => {
              return value ?value.replace(/^Bearer\s+/, '') : undefined
            },
          },
        },
      },
      req,
    )
    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)

    let token: {
      _id: string
      _sessionId: string
      nonce: string
      sub: string
      iat: number
      exp: number
    }

    try {
      token = jwt.verify(req.headers.authorization as string, jwtConfig.jwt_public_access_key, { algorithms: ['RS256'] }) as typeof token
    } catch {
      throw new HttpException(401, 'Invalid token provided', undefined, ErrorCodes.ACCOUNT_AUTHENTICATION_ERROR)
    }

    const jwtSession = await validate_session(new Types.ObjectId(token._id), new Types.ObjectId(token._sessionId), token.nonce)
    if (!jwtSession) throw new HttpException(401, 'Invalid token provided', undefined, ErrorCodes.ACCOUNT_AUTHENTICATION_ERROR)
    if (!jwtSession.session._userId) throw new HttpException(500, 'Invalid session', undefined, ErrorCodes.INTERNAL_SERVER_ERROR)
    if (jwtSession.session.device_id !== (req.headers['device_id'] as string))
      throw new HttpException(401, 'Invalid token provided', undefined, ErrorCodes.ACCOUNT_AUTHENTICATION_ERROR)

    const user = await User.findById(new Types.ObjectId(jwtSession.session._userId as string))
    if (!user) throw new HttpException(401, 'Invalid token provided', undefined, ErrorCodes.ACCOUNT_AUTHENTICATION_ERROR)

    req.user = {
      data: user,
      session: jwtSession.session,
    }

    next()
  } catch (err) {
    return next(err)
  }
}

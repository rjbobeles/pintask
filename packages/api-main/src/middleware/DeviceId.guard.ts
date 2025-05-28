import { NextFunction, Request, Response } from 'express'

import { ErrorCodes } from '../constants'
import { HttpException, validateSchema } from '../utils'

export const DeviceIdGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = await validateSchema(
      {
        device_id: {
          in: ['headers'],
          notEmpty: { errorMessage: 'Device ID cannot be empty' },
          isString: { errorMessage: 'Device ID needs to be a string' },
          isUUID: {
            options: [4],
            errorMessage: 'Device ID must be a valid UUID',
          },
        },
      },
      req,
    )

    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)
    next()
  } catch (err) {
    return next(err)
  }
}

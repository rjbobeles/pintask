import { NextFunction, Request, Response } from 'express'

import { ErrorCodes } from '../constants'
import { HttpException } from '../utils'

export const HttpExceptionHandler = async (err: Error, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof HttpException) {
    return res.status(err.code).json({
      code: err.code,
      error_code: err.error_code,
      message: err.message,
      error: err.errors,
    })
  }

  return res.status(500).json({
    code: 500,
    error_code: ErrorCodes.INTERNAL_SERVER_ERROR,
    message: err.message,
  })
}

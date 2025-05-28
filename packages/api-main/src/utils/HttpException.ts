import { ErrorCodes } from '../constants'

export class HttpException extends Error {
  errors?: string | unknown

  error_code?: string

  code: number

  constructor(code = 500, message: string, errors?: string | unknown, error_code?: ErrorCodes) {
    super()
    this.message = message
    this.errors = errors
    this.code = code
    this.error_code = error_code
  }
}

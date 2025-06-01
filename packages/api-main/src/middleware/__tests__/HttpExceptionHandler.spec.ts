import { NextFunction, Request, Response } from 'express'

import { ErrorCodes } from '../../constants'
import { HttpException } from '../../utils'
import { HttpExceptionHandler } from '../HttpExceptionHandler'

describe('[Middleware] Http Exception Handler', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it('should handle HttpException correctly', async () => {
    const error = new HttpException(400, 'Bad Request', { field: 'error' }, ErrorCodes.VALIDATION_ERROR)

    await HttpExceptionHandler(error, mockRequest as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      error_code: ErrorCodes.VALIDATION_ERROR,
      message: 'Bad Request',
      error: { field: 'error' },
    })
  })

  it('should handle generic Error correctly', async () => {
    const error = new Error('Internal Server Error')

    await HttpExceptionHandler(error, mockRequest as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      error_code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    })
  })

  it('should handle HttpException without errors field', async () => {
    const error = new HttpException(401, 'Unauthorized', undefined, ErrorCodes.ACCOUNT_AUTHENTICATION_ERROR)

    await HttpExceptionHandler(error, mockRequest as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(401)
    expect(mockResponse.json).toHaveBeenCalledWith({
      error_code: ErrorCodes.ACCOUNT_AUTHENTICATION_ERROR,
      message: 'Unauthorized',
      error: undefined,
    })
  })
})

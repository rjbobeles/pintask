import { NextFunction, Request, Response } from 'express'

import { ErrorCodes } from '../../constants'
import { HttpException } from '../../utils'
import { DeviceIdGuard } from '../DeviceId.guard'

describe('[Middleware] Device ID Guard', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: jest.Mock

  beforeEach(() => {
    mockRequest = {
      headers: {},
    }
    mockResponse = {
      status: jest.fn(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it('should pass with valid UUID device_id in headers', async () => {
    mockRequest.headers = {
      device_id: crypto.randomUUID(),
    }

    await DeviceIdGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    expect(nextFunction).toHaveBeenCalledWith()
  })

  it('should fail with empty device_id', async () => {
    mockRequest.headers = {
      device_id: '',
    }

    await DeviceIdGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    const error = nextFunction.mock.calls[0][0]
    expect(error).toBeInstanceOf(HttpException)
    expect(error).toMatchObject({
      code: 400,
      message: 'Unable to process request due to malformed data',
      error_code: ErrorCodes.VALIDATION_ERROR,
    })
  })

  it('should fail with invalid UUID format', async () => {
    mockRequest.headers = {
      device_id: 'invalid-uuid',
    }

    await DeviceIdGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    const error = nextFunction.mock.calls[0][0]
    expect(error).toBeInstanceOf(HttpException)
    expect(error).toMatchObject({
      code: 400,
      message: 'Unable to process request due to malformed data',
      error_code: ErrorCodes.VALIDATION_ERROR,
    })
  })

  it('should fail with missing device_id', async () => {
    mockRequest.headers = {}

    await DeviceIdGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    const error = nextFunction.mock.calls[0][0]
    expect(error).toBeInstanceOf(HttpException)
    expect(error).toMatchObject({
      code: 400,
      message: 'Unable to process request due to malformed data',
      error_code: ErrorCodes.VALIDATION_ERROR,
    })
  })

  it('should fail with non-string device_id', async () => {
    mockRequest.headers = {
      device_id: 123 as any,
    }

    await DeviceIdGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    const error = nextFunction.mock.calls[0][0]
    expect(error).toBeInstanceOf(HttpException)
    expect(error).toMatchObject({
      code: 400,
      message: 'Unable to process request due to malformed data',
      error_code: ErrorCodes.VALIDATION_ERROR,
    })
  })
})

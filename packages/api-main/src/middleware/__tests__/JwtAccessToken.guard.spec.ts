import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

import { jwtConfig } from '../../config/jwtConfig'
import { ErrorCodes } from '../../constants'
import { validate_session } from '../../modules/user-session/service'
import { User } from '../../schema'
import { HttpException } from '../../utils'
import { JwtAccessTokenGuard } from '../JwtAccessToken.guard'

// Mock dependencies
jest.mock('../../modules/user-session/service')
jest.mock('../../schema')
jest.mock('jsonwebtoken')

describe('[Middleware] JWT Access Token Guard', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: jest.Mock

  const mockUserId = new Types.ObjectId()
  const mockSessionId = new Types.ObjectId()
  const mockDeviceId = '123e4567-e89b-12d3-a456-426614174000'
  const mockNonce = 'test-nonce'

  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: 'Bearer mock-token',
        device_id: mockDeviceId,
      },
    }
    mockResponse = {
      status: jest.fn(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()

    // Reset all mocks
    jest.clearAllMocks()
  })

  it('should pass with valid token and session', async () => {
    const mockToken = {
      _id: mockSessionId.toString(),
      _sessionId: mockSessionId.toString(),
      nonce: mockNonce,
      sub: 'test-sub',
      iat: Date.now(),
      exp: Date.now() + 3600,
    }

    const mockUser = { _id: mockUserId }
    const mockSession = {
      _userId: mockUserId,
      device_id: mockDeviceId,
    }

    ;(jwt.verify as jest.Mock).mockReturnValue(mockToken)
    ;(validate_session as jest.Mock).mockResolvedValue({ session: mockSession })
    ;(User.findById as jest.Mock).mockResolvedValue(mockUser)

    await JwtAccessTokenGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    expect(jwt.verify).toHaveBeenCalledWith('mock-token', jwtConfig.jwt_public_access_key, { algorithms: ['RS256'] })
    expect(validate_session).toHaveBeenCalledWith(mockSessionId, mockSessionId, mockNonce)
    expect(User.findById).toHaveBeenCalledWith(mockUserId)
    expect(nextFunction).toHaveBeenCalledWith()
    expect(mockRequest.user).toEqual({
      data: mockUser,
      session: mockSession,
    })
  })

  it('should fail with missing authorization header', async () => {
    mockRequest.headers = {
      device_id: mockDeviceId,
    }

    await JwtAccessTokenGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    const error = nextFunction.mock.calls[0][0]
    expect(error).toBeInstanceOf(HttpException)
    expect(error).toMatchObject({
      code: 400,
      message: 'Unable to process request due to malformed data',
      error_code: ErrorCodes.VALIDATION_ERROR,
    })
  })

  it('should fail with invalid token format', async () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat',
      device_id: mockDeviceId,
    }

    await JwtAccessTokenGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    const error = nextFunction.mock.calls[0][0]
    expect(error).toBeInstanceOf(HttpException)
    expect(error).toMatchObject({
      code: 400,
      message: 'Unable to process request due to malformed data',
      error_code: ErrorCodes.VALIDATION_ERROR,
    })
  })

  it('should fail with invalid JWT token', async () => {
    ;(jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    await JwtAccessTokenGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    const error = nextFunction.mock.calls[0][0]
    expect(error).toBeInstanceOf(HttpException)
    expect(error).toMatchObject({
      code: 401,
      message: 'Invalid token provided',
      error_code: ErrorCodes.ACCOUNT_AUTHENTICATION_ERROR,
    })
  })

  it('should fail with invalid session', async () => {
    const mockToken = {
      _id: mockSessionId.toString(),
      _sessionId: mockSessionId.toString(),
      nonce: mockNonce,
      sub: 'test-sub',
      iat: Date.now(),
      exp: Date.now() + 3600,
    }

    ;(jwt.verify as jest.Mock).mockReturnValue(mockToken)
    ;(validate_session as jest.Mock).mockResolvedValue(null)

    await JwtAccessTokenGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    const error = nextFunction.mock.calls[0][0]
    expect(error).toBeInstanceOf(HttpException)
    expect(error).toMatchObject({
      code: 401,
      message: 'Invalid token provided',
      error_code: ErrorCodes.ACCOUNT_AUTHENTICATION_ERROR,
    })
  })

  it('should fail with mismatched device ID', async () => {
    const mockToken = {
      _id: mockSessionId.toString(),
      _sessionId: mockSessionId.toString(),
      nonce: mockNonce,
      sub: 'test-sub',
      iat: Date.now(),
      exp: Date.now() + 3600,
    }

    const mockSession = {
      _userId: mockUserId,
      device_id: 'different-device-id',
    }

    ;(jwt.verify as jest.Mock).mockReturnValue(mockToken)
    ;(validate_session as jest.Mock).mockResolvedValue({ session: mockSession })

    await JwtAccessTokenGuard(mockRequest as Request, mockResponse as Response, nextFunction as unknown as NextFunction)

    const error = nextFunction.mock.calls[0][0]
    expect(error).toBeInstanceOf(HttpException)
    expect(error).toMatchObject({
      code: 401,
      message: 'Invalid token provided',
      error_code: ErrorCodes.ACCOUNT_AUTHENTICATION_ERROR,
    })
  })
})

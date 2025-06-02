import { ErrorCodes } from '../../constants'
import { HttpException } from '../HttpException'

describe('HttpException', () => {
  it('should create an instance with default values', () => {
    const exception = new HttpException(500, '')
    
    expect(exception).toBeInstanceOf(Error)
    expect(exception.message).toBe('')
    expect(exception.code).toBe(500)
    expect(exception.errors).toBeUndefined()
    expect(exception.error_code).toBeUndefined()
  })

  it('should create an instance with custom values', () => {
    const message = 'Test error message'
    const code = 400
    const errors = { field: 'error details' }
    const errorCode = ErrorCodes.VALIDATION_ERROR

    const exception = new HttpException(code, message, errors, errorCode)

    expect(exception.message).toBe(message)
    expect(exception.code).toBe(code)
    expect(exception.errors).toEqual(errors)
    expect(exception.error_code).toBe(errorCode)
  })

  it('should create an instance with string errors', () => {
    const message = 'Test error message'
    const code = 400
    const errors = 'Error details'
    const errorCode = ErrorCodes.VALIDATION_ERROR

    const exception = new HttpException(code, message, errors, errorCode)

    expect(exception.message).toBe(message)
    expect(exception.code).toBe(code)
    expect(exception.errors).toBe(errors)
    expect(exception.error_code).toBe(errorCode)
  })

  it('should create an instance without error_code', () => {
    const message = 'Test error message'
    const code = 400
    const errors = { field: 'error details' }

    const exception = new HttpException(code, message, errors)

    expect(exception.message).toBe(message)
    expect(exception.code).toBe(code)
    expect(exception.errors).toEqual(errors)
    expect(exception.error_code).toBeUndefined()
  })
}) 
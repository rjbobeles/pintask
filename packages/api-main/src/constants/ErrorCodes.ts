export enum ErrorCodes {
  // User Authentication
  ACCOUNT_ALREADY_EXISTS = 'ACCOUNT_ALREADY_EXISTS',
  ACCOUNT_CREATION_FAILED = 'ACCOUNT_CREATION_FAILED',
  ACCOUNT_CREDENTIALS_INVALID = 'ACCOUNT_CREDENTIALS_INVALID',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  ACCOUNT_AUTHENTICATION_ERROR = 'ACCOUNT_AUTHENTICATION_ERROR',

  // User Session
  SESSION_CREATION_FAILED = 'SESSION_CREATION_FAILED',

  // Task
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  TASK_DELETION_FAILED = 'TASK_DELETION_FAILED',
  TASK_CREATION_FAILED = 'TASK_CREATION_FAILED',
  TASK_UPDATE_FAILED = 'TASK_UPDATE_FAILED',

  // Generic Error Codes
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

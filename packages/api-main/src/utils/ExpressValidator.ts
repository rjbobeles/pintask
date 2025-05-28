import { Request } from 'express'
import { checkSchema, ValidationChain, ValidationError, validationResult } from 'express-validator'

export const validateChains = async (conditions: ValidationChain[], req: Request): Promise<Array<ValidationError> | null> => {
  await Promise.all(conditions.map((validation) => validation.run(req)))
  const errors = validationResult(req)
  if (!errors.isEmpty()) return errors.array()
  return null
}

export const validateSchema = async (schema: Record<string, any>, req: Request): Promise<Array<ValidationError> | null> => {
  const validationChains = checkSchema(schema)
  return validateChains(validationChains, req)
}

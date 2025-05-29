import { NextFunction, Request, Response } from 'express'
import { FilterQuery, Types } from 'mongoose'

import { ErrorCodes } from '../../../constants'
import { UserSession, UserSessionData } from '../../../schema'
import { HttpException, validateSchema } from '../../../utils'

export const ListSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = await validateSchema(
      {
        skip: {
          in: ['query'],
          optional: { options: { nullable: true } },
          toInt: true,
          isInt: {
            options: { min: 0 },
            errorMessage: 'Skip needs to be an integer',
          },
          custom: {
            options: (value: number, { req }: { req: Request }) => {
              if (req.query.limit === undefined && value != undefined) throw new Error('Skip is required when limit is provided')
              return true
            },
          },
        },
        limit: {
          in: ['query'],
          optional: { options: { nullable: true } },
          toInt: true,
          isInt: {
            options: { min: 1, max: 50 },
            errorMessage: 'Limit needs to be an integer between 1 and 50',
          },
          custom: {
            options: (value: number, { req }: { req: Request }) => {
              if (req.query.skip === undefined && value !== undefined) throw new Error('Limit is required when skip is provided')
              return true
            },
          },
        },
        status: {
          in: ['query'],
          optional: { options: { nullable: true } },
          customSanitizer: {
            options: (value: string) => {
              if (typeof value === 'string') {
                return [value]
              }
              return Array.isArray(value) ? value : []
            },
          },
          isArray: {
            errorMessage: 'Status must be an array',
          },
          custom: {
            options: (value: string) => {
              if (!Array.isArray(value)) {
                throw new Error('Status must be an array')
              }
              const validStatuses = ['active', 'expired']
              const invalidItems = value.filter((item) => !validStatuses.includes(item))
              if (invalidItems.length > 0) {
                throw new Error(`Invalid status values: ${invalidItems.join(', ')}. Allowed values are: ${validStatuses.join(', ')}`)
              }
              return true
            },
          },
        },
      },
      req,
    )
    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)

    const searchQuery: FilterQuery<UserSessionData> = { _userId: new Types.ObjectId(req.user.data._id as string) }

    const status = req.query.status as string[]

    if (!status || (status.includes('active') && !status.includes('expired'))) {
      searchQuery.expires_at = { $gt: new Date() }
      searchQuery.$or = [{ invalidated_at: { $exists: false } }, { invalidated_at: undefined }]
    } else if (status.includes('expired') && !status.includes('active')) {
      searchQuery.$or = [{ invalidated_at: { $exists: true, $ne: null } }, { expires_at: { $lt: new Date() } }]
    } else if (status.includes('active') && status.includes('expired')) {
      delete searchQuery.expires_at
      delete searchQuery.$or
    }

    res.json({
      message: 'Successfully retrieved sessions!',
      data: {
        count: await UserSession.countDocuments(searchQuery),
        sessions: await UserSession.find(
          searchQuery,
          { nonce: 0 },
          { skip: req.query.skip !== undefined ? Number(req.query.skip) : 0, limit: req.query.limit ? Number(req.query.limit) : 10 },
        )
          .lean()
          .exec()
          .then((sessions) => sessions.map((session) => ({ ...session, current: session._id.toString() === req.user?.session?._id.toString() }))),
      },
    })
  } catch (error) {
    next(error)
  }
}

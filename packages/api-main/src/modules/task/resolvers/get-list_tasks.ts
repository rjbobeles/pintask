import { NextFunction, Request, Response } from 'express'
import { FilterQuery } from 'mongoose'

import { ErrorCodes } from '../../../constants'
import { Task, TaskData } from '../../../schema'
import { HttpException, validateSchema } from '../../../utils'

export const ListTasks = async (req: Request, res: Response, next: NextFunction) => {
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
        due_date: {
          in: ['query'],
          optional: true,
          isISO8601: {
            options: { strict: true },
            errorMessage: 'Due date must be a valid ISO 8601 date',
          },
        },
        completed: {
          in: ['query'],
          optional: true,
          isBoolean: {
            errorMessage: 'Completed must be a boolean',
          },
          toBoolean: true,
        },
        priority: {
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
            errorMessage: 'Priority must be an array',
          },
          custom: {
            options: (value: string) => {
              if (!Array.isArray(value)) {
                throw new Error('Priority must be an array')
              }
              const validPriority = ['Low', 'Medium', 'High']
              const invalidItems = value.filter((item) => !validPriority.includes(item))
              if (invalidItems.length > 0) {
                throw new Error(`Invalid priority values: ${invalidItems.join(', ')}. Allowed values are: ${validPriority.join(', ')}`)
              }
              return true
            },
          },
        },
      },
      req,
    )
    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)

    const searchQuery: FilterQuery<TaskData> = { _userId: req.user.data._id }

    if (req.query.due_date) {
      const dueDate = new Date(req.query.due_date as string)
      searchQuery['data.due_date'] = {
        $gte: new Date(dueDate.setHours(0, 0, 0, 0)),
        $lt: new Date(dueDate.setHours(23, 59, 59, 999)),
      }
    }
    if (req.query.completed !== undefined) searchQuery['data.completed'] = req.query.completed
    if (req.query.priority && Array.isArray(req.query.priority)) searchQuery['data.priority'] = { $in: req.query.priority }

    res.send({
      message: 'Successfully retrieved tasks',
      data: {
        count: await Task.countDocuments(searchQuery),
        tasks: await Task.find(
          searchQuery,
          {},
          {
            skip: req.query.skip !== undefined ? Number(req.query.skip) : 0,
            limit: req.query.limit ? Number(req.query.limit) : 12,
            sort: { created_at: -1 },
          },
        )
          .lean()
          .exec(),
      },
    })
  } catch (error) {
    next(error)
  }
}

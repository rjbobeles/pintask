import { NextFunction, Request, Response } from 'express'

import { ErrorCodes } from '../../../constants'
import { Task } from '../../../schema'
import { HttpException, validateSchema } from '../../../utils'

export const CreateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = await validateSchema(
      {
        title: {
          in: ['body'],
          notEmpty: { errorMessage: 'Title cannot be empty' },
          isString: { errorMessage: 'Title must be a string' },
          isLength: {
            options: { max: 255 },
            errorMessage: 'Title cannot exceed 255 characters',
          },
          trim: true,
        },
        description: {
          in: ['body'],
          optional: true,
          isString: { errorMessage: 'Description must be a string' },
          isLength: {
            options: { max: 1000 },
            errorMessage: 'Description cannot exceed 1000 characters',
          },
          trim: true,
        },
        priority: {
          in: ['body'],
          optional: true,
          isString: { errorMessage: 'Priority must be a string' },
          isIn: {
            options: [['Low', 'Medium', 'High']],
            errorMessage: 'Priority must be one of: low, medium, high',
          },
        },
        due_date: {
          in: ['body'],
          optional: true,
          isISO8601: {
            options: { strict: true },
            errorMessage: 'Due date must be a valid ISO 8601 date',
          },
        },
      },
      req,
    )
    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)

    const task = await Task.create({
      _userId: req.user.data._id,
      data: {
        title: req.body.title,
        description: req.body.description || '',
        priority: req.body.priority || 'Medium',
        due_date: req.body.due_date ? new Date(req.body.due_date) : null,
      },
      created_at: new Date(),
      updated_at: new Date(),
    }).catch((err) => {
      console.log(err)
      throw new HttpException(500, 'Unable to create task', undefined, ErrorCodes.TASK_CREATION_FAILED)
    })

    res.send({
      message: 'Successfully created task',
      data: task,
    })
  } catch (error) {
    next(error)
  }
}

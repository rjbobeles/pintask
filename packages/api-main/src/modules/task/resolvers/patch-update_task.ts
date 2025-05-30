import { NextFunction, Request, Response } from 'express'
import { AnyKeys, Types } from 'mongoose'

import { ErrorCodes } from '../../../constants'
import { Task, TaskData } from '../../../schema'
import { TaskDataData } from '../../../schema/tasks.schema'
import { HttpException, validateSchema } from '../../../utils'

export const UpdateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = await validateSchema(
      {
        task_id: {
          in: ['params'],
          notEmpty: { errorMessage: 'Task ID cannot be empty' },
          isString: { errorMessage: 'Task ID must be a string' },
          isMongoId: { errorMessage: 'Task ID must be a valid BSON ObjectId' },
        },
        title: {
          in: ['body'],
          optional: true,
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
        completed: {
          in: ['body'],
          optional: true,
          isBoolean: { errorMessage: 'Completed must be a boolean' },
        },
        priority: {
          in: ['body'],
          optional: true,
          isString: { errorMessage: 'Priority must be a string' },
          isIn: {
            options: [['low', 'medium', 'high']],
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
        completed_at: {
          in: ['body'],
          optional: true,
          isISO8601: {
            options: { strict: true },
            errorMessage: 'Completed at must be a valid ISO 8601 date',
          },
        },
      },
      req,
    )
    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)

    const userTask = await Task.findOne({ _id: new Types.ObjectId(req.params.task_id), _userId: req.user.data._id }).lean()
    if (!userTask) throw new HttpException(404, 'Task not found', undefined, ErrorCodes.TASK_NOT_FOUND)

    const updatePayload: AnyKeys<TaskData> = {}
    const updateDataPayload: AnyKeys<TaskDataData> = {}

    if (req.body.title !== undefined) updateDataPayload.title = req.body.title
    if (req.body.description !== undefined) updateDataPayload.description = req.body.description
    if (req.body.completed !== undefined) updateDataPayload.completed = req.body.completed === true
    if (req.body.priority !== undefined) updateDataPayload.priority = req.body.priority
    if (req.body.due_date !== undefined) updateDataPayload.due_date = new Date(req.body.due_date)
    if (req.body.completed_at !== undefined) updateDataPayload.completed_at = new Date(req.body.completed_at)

    if (Object.keys(updateDataPayload).length > 0) {
      if (Object.keys(updateDataPayload).length > 0) updatePayload.data = { ...userTask?.data, ...updateDataPayload }
      if (Object.keys(updatePayload).length > 0) updatePayload.updated_at = new Date()
    }

    const updateAck = await Task.updateOne({ _id: userTask._id }, { $set: updatePayload })
    if (updateAck.modifiedCount !== 1) throw new HttpException(400, 'Unable to update task', undefined, ErrorCodes.TASK_UPDATE_FAILED)

    res.send({
      message: 'Successfully updated task',
    })
  } catch (error) {
    next(error)
  }
}

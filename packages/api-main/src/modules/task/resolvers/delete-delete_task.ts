import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'

import { ErrorCodes } from '../../../constants'
import { Task } from '../../../schema'
import { HttpException, validateSchema } from '../../../utils'

export const DeleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = await validateSchema(
      {
        task_id: {
          in: ['params'],
          notEmpty: { errorMessage: 'Task ID cannot be empty' },
          isString: { errorMessage: 'Task ID must be a string' },
          isMongoId: { errorMessage: 'Task ID must be a valid BSON ObjectId' },
        },
      },
      req,
    )
    if (errors !== null) throw new HttpException(400, 'Unable to process request due to malformed data', errors, ErrorCodes.VALIDATION_ERROR)

    const userTask = await Task.findOne({ _id: new Types.ObjectId(req.params.task_id), _userId: req.user.data._id })
    if (!userTask) throw new HttpException(404, 'Task not found', undefined, ErrorCodes.TASK_NOT_FOUND)

    const deleteAck = await Task.deleteOne({ _id: userTask._id })
    if (deleteAck.deletedCount !== 1) throw new HttpException(500, 'Task deletion failed', errors, ErrorCodes.TASK_DELETION_FAILED)

    res.send({
      message: 'Successfully deleted task',
    })
  } catch (error) {
    next(error)
  }
}

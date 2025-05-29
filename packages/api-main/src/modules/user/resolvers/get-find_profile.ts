import { NextFunction, Request, Response } from 'express'

export const FindProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({
      message: 'You have successfully retrieved your profile',
      data: {
        _id: req.user.data._id,
        first_name: req.user.data.first_name,
        last_name: req.user.data.last_name,
        email: req.user.data.email,
        created_at: req.user.data.created_at,
      },
    })
  } catch (error) {
    next(error)
  }
}

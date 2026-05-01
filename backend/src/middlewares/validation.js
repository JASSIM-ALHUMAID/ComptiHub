import mongoose from 'mongoose'
import { ApiError } from '../utils/apiError.js'

export function validateObjectId(paramName = 'id') {
  return (req, _res, next) => {
    const id = req.params[paramName]

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      next(new ApiError(400, `Invalid ${paramName}. Must be a valid ID.`))
      return
    }

    next()
  }
}

export function validateObjectIdInBody(fieldName = 'userId') {
  return (req, _res, next) => {
    const id = req.body[fieldName]

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      next(new ApiError(400, `Invalid ${fieldName}. Must be a valid ID.`))
      return
    }

    next()
  }
}

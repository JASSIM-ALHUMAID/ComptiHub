import mongoose from 'mongoose'
import { ZodError } from 'zod'

export function notFoundHandler(req, _res, next) {
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`))
}

export function errorHandler(error, _req, res, _next) {
  void _next

  let statusCode = error.statusCode || 500
  let message = error.message || 'Internal server error.'
  let details = error.details

  if (error instanceof ZodError) {
    statusCode = 400
    message = 'Validation failed.'
    details = error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))
  }

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = 'Validation failed.'
    details = Object.values(error.errors).map((issue) => issue.message)
  }

  if (error?.code === 11000) {
    statusCode = 409
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || 'field'
    message = `An account with that ${field} already exists.`
  }

  if (message.startsWith('Route not found:')) {
    statusCode = 404
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
    },
  })
}

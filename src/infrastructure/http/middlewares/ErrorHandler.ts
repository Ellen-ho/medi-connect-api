import { ErrorRequestHandler } from 'express'
import { ValidationError } from '../../error/ValidationError'
import { AuthenticationError } from '../../error/AuthenticationError'
import { NotFoundError } from '../../error/NotFoundError'

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req,
  res,
  next
) => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    })
    return
  }

  if (err instanceof AuthenticationError) {
    res.status(401).json({
      status: 'error',
      message: err.message,
    })
    return
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({
      status: 'error',
      message: err.message,
    })
    return
  }

  res.status(500).json({
    status: 'error',
    message: String(err),
  })
}

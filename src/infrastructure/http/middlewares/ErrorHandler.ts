import { ErrorRequestHandler } from 'express';

interface ApiError extends Error {
  status?: number;
}

export const errorHandler: ErrorRequestHandler = (err: unknown, req, res, next) => {
  if (err instanceof Error) {
    const apiError = err as ApiError;
    res.status(apiError.status ?? 500).json({
      status: 'error',
      message: apiError.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: String(err),
    });
  }
  next(err as Error);
};
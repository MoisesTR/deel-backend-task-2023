import { NextFunction, Request, Response } from "express";
import { AppError } from "src/utils/app.error";

export const errorMiddleware = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const error = { ...err };
  error.message = err.message;

  if (error.isOperational) {
    res.status(err.status || 500).json(error);
  } else {
    error.message = "Unexpected error has been ocurred.";
    res.status(err.status || 500).json(error);
  }
};

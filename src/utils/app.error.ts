export class AppError extends Error {
  status: number;
  isOperational: boolean;

  /**
   * Constructs an application-specific error.
   * @param message - The error message.
   * @param status - The HTTP status code for the error. Defaults to 500.
   */
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export interface ErrorObject {
  status: number;
  message: string;
}

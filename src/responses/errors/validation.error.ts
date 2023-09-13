import statusCode from 'http-status';
import { ZodError } from 'zod';

import { ApiError } from './api.error';

export class ValidationError extends ApiError {
  error: ZodError;

  constructor(error: ZodError) {
    super(error.errors.map((error) => error.message).join(', '), statusCode.UNPROCESSABLE_ENTITY);
    this.error = error;
  }

  toJSON() {
    const errors = this.error.errors.map((error) => {
      return {
        field: error.path.join('.') || (error as any)?.keys?.at(0) || '',
        code: error.code,
        message: error.message,
      };
    });

    return {
      errors,
      success: false,
      statusCode: this.statusCode,
    };
  }
}

import { HttpError } from '@genossys-hospital/http-sdk';
import {
  UnauthorizedError,
  ValidationError,
  ServerError,
  NetworkError,
  AppError,
} from '@genossys-hospital/core/libs/error';

/**
 * Mapper to transform SDK/HTTP errors into Domain-specific AppErrors
 */
export class AuthErrorMapper {
  static toDomain(error: unknown): AppError {
    // 1. Handle normalized HttpError from our SDK
    if (error instanceof HttpError) {
      switch (error.status) {
        case 401:
          return new UnauthorizedError(error.message);
        case 422: {
          // Safe extraction of validation details
          const details = this.extractValidationDetails(error.originalError);
          return new ValidationError(details, error.message);
        }
        case 500:
          return new ServerError(error.message);
        case 0:
          return new NetworkError(error.message);
        default:
          return new AppError(error.message, error.code || 'UNKNOWN', error.status || 500);
      }
    }

    // 2. Handle generic errors
    if (error instanceof Error) {
      return new AppError(error.message, 'UNKNOWN');
    }

    return new AppError('An unexpected error occurred', 'UNKNOWN');
  }

  private static extractValidationDetails(error: unknown): Record<string, string | string[]> {
    if (!error || typeof error !== 'object') return {};
    
    // Check if it's an object with response.data.errors
    const errObj = error as Record<string, unknown>;
    const response = errObj['response'] as Record<string, unknown> | undefined;
    const data = response?.['data'] as Record<string, unknown> | undefined;
    const errors = data?.['errors'] as Record<string, string | string[]> | undefined;
    
    return errors || {};
  }
}

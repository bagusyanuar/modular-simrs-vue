import { HttpError } from '@genossys-hospital/http-sdk';
import {
  UnauthorizedError,
  ValidationError,
  ServerError,
  NetworkError,
  AppError,
} from '@genossys-hospital/core/libs';

/**
 * Global Infrastructure Error Mapper
 * Transforms normalized HttpErrors from SDKs into Domain-specific AppErrors
 */
export class ErrorMapper {
  static toDomain(error: unknown): AppError {
    // 1. Handle normalized HttpError from our internal SDKs
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
          return new AppError(
            error.message,
            error.code || 'UNKNOWN_INFRA_ERROR',
            error.status || 500
          );
      }
    }

    // 2. Handle generic Error objects
    if (error instanceof Error) {
      // If it's already an AppError (e.g. re-thrown from other layer), keep it
      if (error instanceof AppError) return error;

      return new AppError(error.message, 'UNEXPECTED_ERROR');
    }

    // 3. Fallback for unknown types
    return new AppError(
      'An unexpected infrastructure error occurred',
      'UNKNOWN_ERROR'
    );
  }

  /**
   * Safely extract validation errors from Axios/SDK response data
   */
  private static extractValidationDetails(
    error: unknown
  ): Record<string, string | string[]> {
    if (!error || typeof error !== 'object') return {};

    const errObj = error as Record<string, unknown>;
    const response = errObj['response'] as Record<string, unknown> | undefined;
    const data = response?.['data'] as Record<string, unknown> | undefined;

    // Support standard Genossys error structure: { success: false, errors: { ... } }
    const errors = data?.['errors'] as
      | Record<string, string | string[]>
      | undefined;

    return errors || {};
  }
}

/**
 * Utility to wrap infrastructure calls and automatically map errors to AppError
 */
export async function handleAppError<T>(task: () => Promise<T>): Promise<T> {
  try {
    return await task();
  } catch (err) {
    throw ErrorMapper.toDomain(err);
  }
}

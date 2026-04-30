export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;

    const V8Error = Error as unknown as {
      captureStackTrace: (
        target: object,
        owner?: abstract new (...args: never[]) => unknown
      ) => void;
    };

    if (typeof V8Error.captureStackTrace === 'function') {
      V8Error.captureStackTrace(this, AppError);
    }
  }

  static isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
  }
}

/**
 * 400 - Bad Request
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', code = 'BAD_REQUEST', details?: unknown) {
    super(message, code, 400, details);
  }
}

/**
 * 401 - Unauthorized (Login failed / Token invalid)
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Sesi berakhir atau login gagal', code = 'UNAUTHORIZED') {
    super(message, code, 401);
  }
}

/**
 * 403 - Forbidden (Don't have permission)
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Anda tidak memiliki akses', code = 'FORBIDDEN') {
    super(message, code, 403);
  }
}

/**
 * 404 - Not Found
 */
export class NotFoundError extends AppError {
  constructor(message = 'Data tidak ditemukan', code = 'NOT_FOUND') {
    super(message, code, 404);
  }
}

/**
 * 422 - Validation Error (Form errors from Backend)
 */
export class ValidationError extends AppError {
  constructor(details: Record<string, string | string[]>, message = 'Data tidak valid') {
    super(message, 'VALIDATION_ERROR', 422, details);
  }
}

/**
 * 500 - Internal Server Error
 */
export class ServerError extends AppError {
  constructor(message = 'Terjadi kesalahan pada server', code = 'SERVER_ERROR') {
    super(message, code, 500);
  }
}

/**
 * Custom - Network Error (Connection lost)
 */
export class NetworkError extends AppError {
  constructor(message = 'Koneksi internet terganggu', code = 'NETWORK_ERROR') {
    super(message, code, 0);
  }
}

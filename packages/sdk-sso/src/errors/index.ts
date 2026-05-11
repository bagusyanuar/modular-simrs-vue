/**
 * Base SSO Error class
 * All SDK errors extend this for easy instanceof checks
 */
export class SSOError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'SSOError';
  }
}

/**
 * PKCE flow errors (verifier missing, challenge generation failed)
 */
export class PKCEError extends SSOError {
  constructor(message: string) {
    super(message, 'PKCE_ERROR');
    this.name = 'PKCEError';
  }
}

/**
 * OAuth state parameter mismatch between request and callback
 */
export class StateMismatchError extends SSOError {
  constructor() {
    super('OAuth state mismatch. Possible CSRF attack.', 'STATE_MISMATCH');
    this.name = 'StateMismatchError';
  }
}

/**
 * Token exchange failed (code → token)
 */
export class TokenExchangeError extends SSOError {
  public readonly originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message, 'TOKEN_EXCHANGE_ERROR');
    this.name = 'TokenExchangeError';
    this.originalError = originalError;
  }
}

/**
 * Session expired or invalid
 */
export class SessionExpiredError extends SSOError {
  constructor() {
    super('Session has expired or is invalid.', 'SESSION_EXPIRED');
    this.name = 'SessionExpiredError';
  }
}

/**
 * Authorize URL generation failed
 */
export class AuthorizeError extends SSOError {
  public readonly originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message, 'AUTHORIZE_ERROR');
    this.name = 'AuthorizeError';
    this.originalError = originalError;
  }
}

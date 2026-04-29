export interface SSOConfig {
  baseUrl: string;
  portalUrl: string;
  clientId: string;
  redirectUri: string;
  endpoints?: {
    authorize?: string;
    token?: string;
    logout?: string;
  };
  /** Persistence strategy for access token: 'memory' (default), 'localstorage', or 'cookie' */
  persistence?: 'memory' | 'localstorage' | 'cookie';
  /** External state management hooks (e.g. Pinia) */
  onSaveToken?: (token: string) => void;
  onGetToken?: () => string | null;
  onClearToken?: () => void;
  /** Custom keys for storage */
  storageKeys?: {
    accessToken?: string;
    expiresAt?: string;
    pkceVerifier?: string;
    pkceState?: string;
  };
  /** Cookie expiration in days (Default: 7) */
  cookieExpires?: number;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

export interface AuthSession {
  accessToken: string;
  expiresAt: number;
}

export interface PKCEPair {
  verifier: string;
  challenge: string;
  state: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SSOUser {
  id: string;
  email: string;
  name?: string;
  [key: string]: unknown;
}

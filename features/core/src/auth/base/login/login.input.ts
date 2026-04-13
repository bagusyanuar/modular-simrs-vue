/**
 * Core Auth Inputs (Forms/Parameters)
 */

export interface AuthCredentials {
  username?: string;
  password?: string;
  code?: string; // For SSO/OAuth callbacks
}

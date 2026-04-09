import CryptoJS from 'crypto-js';

/**
 * PKCE (Proof Key for Code Exchange) Utilities
 * Follows RFC 7636 standard for OAuth 2.0
 */

/**
 * Generates a high-entropy cryptographically strong random string.
 * @param length - The length of the verifier (min 43, max 128)
 */
export function generateVerifier(length: number = 64): string {
  if (length < 43 || length > 128) {
    throw new Error('Verifier length must be between 43 and 128 characters.');
  }

  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else if (typeof crypto !== 'undefined' && (crypto as any).getRandomValues) {
    (crypto as any).getRandomValues(array);
  } else {
    // Fallback if Crypto API is totally unavailable (e.g. non-secure context in old browsers)
    for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(array)
    .map((x) => charset[x % charset.length])
    .join('');
}

/**
 * Generates a SHA-256 challenge from a verifier.
 * @param verifier - The code verifier string
 */
export async function generateChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  
  let hash: ArrayBuffer;
  
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    hash = await window.crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(hash);
  } else if (typeof crypto !== 'undefined' && (crypto as any).subtle) {
    hash = await (crypto as any).subtle.digest('SHA-256', data);
    return base64UrlEncode(hash);
  } else {
    // Fallback to crypto-js SHA256 when window.crypto.subtle is not available (HTTP)
    const hashWordWordArray = CryptoJS.SHA256(verifier);
    const base64Str = CryptoJS.enc.Base64.stringify(hashWordWordArray);
    return base64Str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}

/**
 * Base64Url encoding (RFC 4648)
 * Transforms standard Base64 to be safe for URLs.
 */
function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}


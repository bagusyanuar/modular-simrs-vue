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
  
  // Use crypto API if available
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else if (typeof crypto !== 'undefined' && (crypto as any).getRandomValues) {
    (crypto as any).getRandomValues(array);
  } else {
    throw new Error('Crypto API not available.');
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
  } else if (typeof crypto !== 'undefined' && (crypto as any).subtle) {
    hash = await (crypto as any).subtle.digest('SHA-256', data);
  } else {
    throw new Error(
      'Web Crypto API (subtle) not available. PKCE requires a Secure Context (HTTPS or localhost). ' + 
      'If using custom domains, please enable "unsafely-treat-insecure-origin-as-secure" in browser flags.'
    );
  }

  return base64UrlEncode(hash);
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

import CryptoJS from 'crypto-js';

/**
 * PKCE (Proof Key for Code Exchange) Helpers
 * Uses CryptoJS for SHA256 to support non-secure contexts (HTTP with custom domains).
 */

// Generate Code Verifier: String acak panjang
export const generateVerifier = (): string => {
  const array = new Uint32Array(56);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substring(-2)).join('');
};

// Generate Code Challenge from Verifier: Base64URL(SHA256(code_verifier))
export const generateChallenge = async (verifier: string): Promise<string> => {
  // Pake CryptoJS biar aman di HTTP + Custom Domain
  const hash = CryptoJS.SHA256(verifier);
  
  return CryptoJS.enc.Base64.stringify(hash)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Generate a random string for CSRF protection (state)
 */
export const generateRandomString = (length = 32): string => {
  const array = new Uint32Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substring(-2)).join('');
};

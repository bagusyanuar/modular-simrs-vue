import CryptoJS from 'crypto-js';

/**
 * PKCE (Proof Key for Code Exchange) Helpers
 * Standard implementation for OAuth2 PKCE Flow
 */

/**
 * Generate a cryptographically strong random string
 */
export const generateRandomString = (length = 64): string => {
  const array = new Uint32Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).slice(-2)).join('');
};

/**
 * Generate Code Challenge from Verifier: Base64URL(SHA256(code_verifier))
 */
export const generateChallenge = async (verifier: string): Promise<string> => {
  // Use Web Crypto API if available, fallback to CryptoJS
  if (window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Fallback to CryptoJS for non-secure contexts (if any)
  const hash = CryptoJS.SHA256(verifier);
  return CryptoJS.enc.Base64.stringify(hash)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Create a full PKCE pair including state
 */
export const createPKCEPair = async (): Promise<{ verifier: string; challenge: string; state: string }> => {
  const verifier = generateRandomString(96);
  const challenge = await generateChallenge(verifier);
  const state = generateRandomString(32);

  return { verifier, challenge, state };
};

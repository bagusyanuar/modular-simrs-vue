/**
 * PKCE (Proof Key for Code Exchange) Helpers
 * Uses Web Crypto API for secure random values and hashing.
 */

// Generate Code Verifier: String acak panjang (43-128 karakter)
export const generateVerifier = (): string => {
  const array = new Uint32Array(56);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substring(-2)).join('');
};

// Generate Code Challenge from Verifier: Base64URL(SHA256(code_verifier))
export const generateChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

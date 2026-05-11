import type { PKCEPair } from '../types';

/**
 * Helper to get the native Crypto API in both Browser and Node.js
 * Uses a dynamic function to prevent bundlers (Vite/Webpack) from resolving 'node:crypto'
 */
function getCrypto(): Crypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  if (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node
  ) {
    try {
      const nodeCrypto = new Function('return require("node:crypto")')();
      return nodeCrypto.webcrypto as Crypto;
    } catch {
      // Ignore
    }
  }
  throw new Error('Web Crypto API is not available in this environment.');
}

/**
 * PKCE Helper using native Web Crypto API
 * Isomorphic: works in Browser and Node.js (SSR/Vitest)
 */
export class PKCEHelper {
  /**
   * Generates a random code verifier
   */
  public static generateVerifier(length: number = 64): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    getCrypto().getRandomValues(randomValues);

    let verifier = '';
    for (let i = 0; i < length; i++) {
      verifier += charset.charAt(randomValues[i]! % charset.length);
    }
    return verifier;
  }

  /**
   * Generates a code challenge from a verifier using SHA-256 (Web Crypto API)
   */
  public static async generateChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await getCrypto().subtle.digest('SHA-256', data);
    return this.base64UrlEncode(digest);
  }

  /**
   * Creates both verifier and challenge (async due to Web Crypto)
   */
  public static async createPair(): Promise<PKCEPair> {
    const codeVerifier = this.generateVerifier();
    const codeChallenge = await this.generateChallenge(codeVerifier);
    return { codeVerifier, codeChallenge };
  }

  private static base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}

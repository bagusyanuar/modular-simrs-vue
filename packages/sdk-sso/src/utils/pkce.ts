import CryptoJS from 'crypto-js';
import type { PKCEPair } from '../types';

export class PKCEHelper {
  /**
   * Generates a random code verifier
   */
  public static generateVerifier(length: number = 64): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomWords = CryptoJS.lib.WordArray.random(length);
    const randomBytes = this.wordArrayToUint8Array(randomWords);

    let verifier = '';
    for (let i = 0; i < length; i++) {
      verifier += charset.charAt(randomBytes[i]! % charset.length);
    }
    return verifier;
  }

  /**
   * Generates a code challenge from a verifier using SHA256
   */
  public static generateChallenge(verifier: string): string {
    const hash = CryptoJS.SHA256(verifier);
    return this.base64UrlEncode(hash);
  }

  /**
   * Creates both verifier and challenge
   */
  public static createPair(): PKCEPair {
    const codeVerifier = this.generateVerifier();
    const codeChallenge = this.generateChallenge(codeVerifier);
    return { codeVerifier, codeChallenge };
  }

  private static base64UrlEncode(hash: CryptoJS.lib.WordArray): string {
    return hash
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private static wordArrayToUint8Array(
    wordArray: CryptoJS.lib.WordArray
  ): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
      const byte = (words[i >>> 2]! >>> (24 - (i % 4) * 8)) & 0xff;
      u8[i] = byte;
    }
    return u8;
  }
}

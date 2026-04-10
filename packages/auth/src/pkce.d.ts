/**
 * PKCE (Proof Key for Code Exchange) Utilities
 * Follows RFC 7636 standard for OAuth 2.0
 */
/**
 * Generates a high-entropy cryptographically strong random string.
 * @param length - The length of the verifier (min 43, max 128)
 */
export declare function generateVerifier(length?: number): string;
/**
 * Generates a SHA-256 challenge from a verifier.
 * @param verifier - The code verifier string
 */
export declare function generateChallenge(verifier: string): Promise<string>;
//# sourceMappingURL=pkce.d.ts.map
import { useRoute } from 'vue-router';
import { CookieStorage } from '@genrs/sso';

/**
 * 🏴‍☠️ Global state for internal OAuth parameters (e.g. from PKCE generation)
 * Shared across composables to maintain sync.
 */
const directParams = {
  client_id: '',
  redirect_uri: '',
  state: '',
  code_challenge: '',
  verifier: '',
};

export function useOAuthParams() {
  const route = useRoute();

  /** Get OAuth parameter from URL, Route Query, or Internal State */
  function getOAuthParam(key: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return (
      urlParams.get(key) ||
      (route.query[key] as string) ||
      (directParams as any)[key]
    );
  }

  /** Standard OAuth redirect: send code+state back to client app's callback */
  function performRedirect(code: string, state: string, redirectUri: string) {
    const url = new URL(redirectUri);
    url.searchParams.set('code', code);
    url.searchParams.set('state', state);

    // 🕵️‍♂️ Resolve verifier: internal state > sessionStorage > Cookie
    const verifier =
      directParams.verifier ||
      sessionStorage.getItem('sso_verifier') ||
      CookieStorage.get('sso_verifier');

    if (verifier) {
      url.hash = `verifier=${verifier}`;
    }

    window.location.href = url.toString();
  }

  return {
    directParams,
    getOAuthParam,
    performRedirect,
  };
}

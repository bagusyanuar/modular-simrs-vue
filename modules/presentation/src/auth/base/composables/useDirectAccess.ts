import { getEnv } from '@genrs/utils';

export function useDirectAccess() {
  /** Detect if this is a TRULY direct access (ALL OAuth params are missing) */
  function isDirectAccess(): boolean {
    const params = new URLSearchParams(window.location.search);
    const hasClientId = !!params.get('client_id');
    const hasRedirectUri = !!params.get('redirect_uri');
    const hasState = !!params.get('state');
    const hasChallenge = !!params.get('code_challenge');

    return !hasClientId && !hasRedirectUri && !hasState && !hasChallenge;
  }

  function handleDiscoveryRedirect() {
    const redirectUri = getEnv('VITE_SSO_REDIRECT_URI') || '';
    const clientUrl = redirectUri.split('/callback')[0] || '/';
    window.location.href = clientUrl;
  }

  return {
    isDirectAccess,
    handleDiscoveryRedirect,
  };
}

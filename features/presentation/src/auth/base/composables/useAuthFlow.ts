import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { SessionManager } from '@genrs/auth';

/**
 * Composable to handle the SSO Authentication Flow on the Auth Server side.
 */
export function useAuthFlow() {
  const route = useRoute();
  const email = ref('admin@genrs.com');
  const password = ref('admin123');
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isAuthenticated = ref(SessionManager.isAuthenticated());

  /**
   * Auto-redirect if already logged in and has SSO context
   */
  onMounted(() => {
    console.log('🔍 Checking Session Status...', { 
      isAuthenticated: isAuthenticated.value, 
      hasRedirectUri: !!route.query.redirect_uri 
    });

    if (isAuthenticated.value) {
      if (route.query.redirect_uri) {
        console.log('🔄 User already authenticated. Performing auto-redirect...');
        performSSORedirect();
      } else {
         console.log('ℹ️ User already authenticated but no redirect_uri found.');
         // Kita biarkan UI yang nanganin (nampilin tombol dashboard)
      }
    }
  });

  /**
   * Internal helper to build callback URL and redirect
   */
  function performSSORedirect() {
    const redirectUri = route.query.redirect_uri as string;
    const state = route.query.state as string;

    if (!redirectUri) return;

    const dummyCode = `auth_code_${Math.random().toString(36).substring(7)}`;
    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set('code', dummyCode);
    if (state) callbackUrl.searchParams.set('state', state);

    window.location.href = callbackUrl.toString();
  }

  /**
   * Mock login handler.
   */
  async function handleLogin() {
    // Validasi Dummy Simple
    if (email.value !== 'admin@genrs.com' || password.value !== 'admin123') {
      error.value = 'Email atau Password salah! (Gunakan: admin@genrs.com / admin123)';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      // 1. Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 2. Simpan session (biar dianggep login di domain sso)
      // Kita buat mock payload
      SessionManager.save({
        accessToken: 'mock-access-token-authenticated',
        refreshToken: 'mock-refresh-token-authenticated'
      });

      // 3. Handle Redirection
      if (route.query.redirect_uri) {
        performSSORedirect();
      } else {
        // Redirect otomatis ke aplikasi utama jika tidak ada instruksi khusus
        window.location.href = '/simrs/';
      }
    } catch (e) {
      error.value = 'Login failed. Please try again.';
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  return {
    email,
    password,
    loading,
    error,
    isAuthenticated,
    handleLogin,
  };
}

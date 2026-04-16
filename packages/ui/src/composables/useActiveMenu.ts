import { useRoute } from 'vue-router';

export function useActiveMenu() {
  const route = useRoute();

  /**
   * Menentukan apakah menu aktif berdasarkan path.
   * Fungsi ini otomatis reaktif karena menggunakan 'route' dari vue-router.
   */
  const isActive = (path?: string) => {
    if (!path) return false;

    // Ambil path dari router (Internal SPA)
    const routerPath = route?.path || '/';
    // Ambil path dari browser (External/Proxy)
    const browserPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    // 1. Exact match (Internal atau External)
    if (routerPath === path || browserPath === path) return true;

    // 2. Special Case: Dashboard root (/) often matches /dashboard
    if (path === '/dashboard' && (routerPath === '/' || browserPath === '/')) return true;
    if (path === '/' && (routerPath === '/dashboard' || browserPath === '/dashboard')) return true;

    // 3. Prefix match untuk sub-menu
    const checkPrefix = (current: string, target: string) => {
      if (!target || target === '/') return false;
      if (current.startsWith(target)) {
        const nextChar = current.slice(target.length, target.length + 1);
        return !nextChar || nextChar === '/';
      }
      return false;
    };

    return checkPrefix(routerPath, path) || checkPrefix(browserPath, path);
  };

  return {
    isActive,
  };
}

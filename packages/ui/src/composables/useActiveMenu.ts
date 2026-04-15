import { useBrowserLocation } from '@vueuse/core';

export function useActiveMenu() {
  const location = useBrowserLocation();

  /**
   * Menentukan apakah menu aktif berdasarkan path.
   * Mendukung pengecekan internal route (V1) dan external path (V2 via proxy).
   */
  const isActive = (path?: string) => {
    if (!path) return false;

    const currentPath = location.value.pathname || '/';

    // 1. Exact match
    if (currentPath === path) return true;

    // 2. Prefix match untuk sub-menu atau routing V2
    if (path !== '/' && currentPath.startsWith(path)) {
      const nextChar = currentPath.slice(path.length, path.length + 1);
      return !nextChar || nextChar === '/';
    }

    return false;
  };

  return {
    isActive,
    location,
  };
}

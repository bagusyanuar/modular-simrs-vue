/**
 * CookieStorage Utility
 * Digunakan untuk sharing token antara V1 (Webpack) dan V2 (Vite)
 */
export class CookieStorage {
  private static domain = '.neurovi-simulation.test';

  /**
   * Simpan data ke cookie
   * @param name Nama cookie
   * @param value Nilai (akan di-encode otomatis)
   * @param days Masa berlaku (default 7 hari)
   */
  static set(name: string, value: string, days = 7): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=${this.domain}; SameSite=Lax`;
  }

  /**
   * Ambil data dari cookie
   * @param name Nama cookie
   */
  static get(name: string): string | null {
    const nameLenPlus = name.length + 1;
    return (
      document.cookie
        .split(';')
        .map((c) => c.trim())
        .filter((cookie) => cookie.substring(0, nameLenPlus) === `${name}=`)
        .map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] || null
    );
  }

  /**
   * Hapus cookie
   * @param name Nama cookie
   */
  static remove(name: string): void {
    this.set(name, '', -1);
  }
}

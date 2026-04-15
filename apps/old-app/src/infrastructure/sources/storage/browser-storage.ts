import { STORAGE_KEYS } from './storage.keys';

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export class BrowserStorage {
  static set<T>(key: StorageKey, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch {
      /* empty */
    }
  }

  static get<T>(key: StorageKey): T | null {
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  static remove(key: StorageKey): void {
    localStorage.removeItem(key);
  }
}

import { createStore, Store } from '@tauri-apps/plugin-store';
import { StateStorage } from 'zustand/middleware';

// Check if we are running in a Tauri environment
// In Tauri, window.__TAURI_INTERNALS__ or similar is usually present
const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__ !== undefined;

let tauriStore: Store | null = null;

async function getTauriStore(): Promise<Store | null> {
  if (!isTauri) return null;
  if (!tauriStore) {
    try {
      tauriStore = await createStore('libero.store');
    } catch (e) {
      console.warn('Tauri store not available, falling back to localStorage', e);
      return null;
    }
  }
  return tauriStore;
}

export const appStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (isTauri) {
      const store = await getTauriStore();
      if (store) {
        const data = await store.get<any>(name);
        return data ? JSON.stringify(data) : null;
      }
    }
    return localStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (isTauri) {
      const store = await getTauriStore();
      if (store) {
        try {
          const parsed = JSON.parse(value);
          await store.set(name, parsed);
          await store.save();
          return;
        } catch (e) {
          // If value is not JSON, store as is
          await store.set(name, value);
          await store.save();
          return;
        }
      }
    }
    localStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (isTauri) {
      const store = await getTauriStore();
      if (store) {
        await store.delete(name);
        await store.save();
        return;
      }
    }
    localStorage.removeItem(name);
  },
};

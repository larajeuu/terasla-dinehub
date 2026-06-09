import { create } from 'zustand';

const AUTH_KEY  = 'admin_auth';
const TOKEN_KEY = 'token'; // api.js reads this key via interceptor

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

const useAuthStore = create((set) => ({
  ...loadFromStorage(),

  setAuth: ({ user, token }) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null });
  },
}));

export default useAuthStore;

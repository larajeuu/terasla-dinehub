import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setAuth: ({ user, token }) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

export default useAuthStore;

import { create } from 'zustand';

const STORAGE_KEY = 'dining-table';

const readInitial = () => {
  if (typeof window === 'undefined') return { code: null, label: null };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { code: null, label: null };
    const parsed = JSON.parse(raw);
    return {
      code: typeof parsed.code === 'string' ? parsed.code : null,
      label: typeof parsed.label === 'string' ? parsed.label : null,
    };
  } catch {
    return { code: null, label: null };
  }
};

const persist = (state) => {
  try {
    if (state.code && state.label) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ code: state.code, label: state.label })
      );
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* sessionStorage unavailable — keep memory state only */
  }
};

const useTableStore = create((set) => ({
  ...readInitial(),

  setTable: ({ code, label }) =>
    set(() => {
      const next = { code, label };
      persist(next);
      return next;
    }),

  clearTable: () =>
    set(() => {
      const next = { code: null, label: null };
      persist(next);
      return next;
    }),
}));

export default useTableStore;

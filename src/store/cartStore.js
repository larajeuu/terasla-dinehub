import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, qty: 1 }] };
    }),

  decreaseItem: (id) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === id);
      if (!existing) return state;
      if (existing.qty === 1) {
        return { items: state.items.filter((i) => i.id !== id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === id ? { ...i, qty: i.qty - 1 } : i
        ),
      };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  clearCart: () => set({ items: [] }),

  getItemQty: (id) => {
    const item = get().items.find((i) => i.id === id);
    return item ? item.qty : 0;
  },

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

  getTotalPrice: () =>
    get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));

export default useCartStore;

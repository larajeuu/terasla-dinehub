import { create } from 'zustand';

// Harga satuan efektif = harga produk + total harga add-on yang DIPILIH.
// Add-on yang dipilih disimpan di `item.selectedAddons` (berbeda dari daftar
// add-on yang tersedia di `product.additionals`).
export const itemUnitPrice = (item) =>
  (item.harga || 0) +
  (item.selectedAddons?.reduce((s, a) => s + (a.harga || a.price || 0), 0) || 0);

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

  setItemQty: (product, qty) =>
    set((state) => {
      if (qty <= 0) {
        return { items: state.items.filter((i) => i.id !== product.id) };
      }
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, qty }] };
    }),

  // Tambah/ubah item beserta add-on terpilih (dipakai ProductDetailModal).
  // Mengganti seluruh konfigurasi add-on untuk product.id ini.
  setItemWithAddons: (product, selectedAddons, qty) =>
    set((state) => {
      if (qty <= 0) {
        return { items: state.items.filter((i) => i.id !== product.id) };
      }
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, ...product, selectedAddons, qty } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, selectedAddons, qty }] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  clearCart: () => set({ items: [] }),

  getItemQty: (id) => {
    const item = get().items.find((i) => i.id === id);
    return item ? item.qty : 0;
  },

  getItem: (id) => get().items.find((i) => i.id === id) || null,

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

  getTotalPrice: () =>
    get().items.reduce((sum, i) => sum + itemUnitPrice(i) * i.qty, 0),
}));

export default useCartStore;

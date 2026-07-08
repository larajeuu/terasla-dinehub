import { create } from 'zustand';

// Harga satuan efektif = harga produk + total harga add-on yang DIPILIH.
// Add-on yang dipilih disimpan di `item.selectedAddons` (berbeda dari daftar
// add-on yang tersedia di `product.additionals`).
export const itemUnitPrice = (item) =>
  (item.harga || 0) +
  (item.selectedAddons?.reduce((s, a) => s + (a.harga || a.price || 0), 0) || 0);

// Kunci baris keranjang = produk + kombinasi add-on terpilih. Produk yang sama
// dengan add-on berbeda menjadi BARIS TERPISAH, sehingga pelanggan bisa memesan
// mis. 1x Ayam Geprek + Keju dan 1x Ayam Geprek tanpa tambahan sekaligus.
export const lineKeyOf = (productId, selectedAddons) => {
  const addonPart = (selectedAddons || [])
    .map((a) => a.id)
    .sort((x, y) => x - y)
    .join(',');
  return `${productId}|${addonPart}`;
};

// Baris terakhir milik sebuah produk — target operasi stepper di kartu produk
// (tanpa konteks add-on): tambah/kurang berlaku pada konfigurasi terakhir.
const lastLineOf = (items, productId) => {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (items[i].id === productId) return items[i];
  }
  return null;
};

const withQty = (items, lineKey, qty) => {
  if (qty <= 0) return items.filter((i) => i.lineKey !== lineKey);
  return items.map((i) => (i.lineKey === lineKey ? { ...i, qty } : i));
};

const useCartStore = create((set, get) => ({
  // Tiap item = satu BARIS: { ...product, qty, selectedAddons, lineKey }
  items: [],

  // +1 pada baris terakhir produk ini; bila belum ada, buat baris polos
  // (tanpa add-on). Dipakai stepper kartu produk / modal tanpa add-on.
  addItem: (product) =>
    set((state) => {
      const line = lastLineOf(state.items, product.id);
      if (line) return { items: withQty(state.items, line.lineKey, line.qty + 1) };
      const lineKey = lineKeyOf(product.id, []);
      return {
        items: [...state.items, { ...product, qty: 1, selectedAddons: [], lineKey }],
      };
    }),

  // −1 pada baris terakhir produk ini (baris terhapus bila qty habis).
  decreaseItem: (id) =>
    set((state) => {
      const line = lastLineOf(state.items, id);
      if (!line) return state;
      return { items: withQty(state.items, line.lineKey, line.qty - 1) };
    }),

  // Set qty baris terakhir produk ini; bila belum ada, buat baris polos.
  setItemQty: (product, qty) =>
    set((state) => {
      const line = lastLineOf(state.items, product.id);
      if (line) return { items: withQty(state.items, line.lineKey, qty) };
      if (qty <= 0) return state;
      const lineKey = lineKeyOf(product.id, []);
      return {
        items: [...state.items, { ...product, qty, selectedAddons: [], lineKey }],
      };
    }),

  // Tambah dari modal detail: gabung ke baris dengan kombinasi add-on yang SAMA
  // (qty dijumlahkan), atau buat baris baru bila kombinasinya belum ada.
  addItemWithAddons: (product, selectedAddons, qty) =>
    set((state) => {
      if (qty <= 0) return state;
      const lineKey = lineKeyOf(product.id, selectedAddons);
      const existing = state.items.find((i) => i.lineKey === lineKey);
      if (existing) {
        return { items: withQty(state.items, lineKey, existing.qty + qty) };
      }
      return {
        items: [
          ...state.items,
          { ...product, qty, selectedAddons: selectedAddons || [], lineKey },
        ],
      };
    }),

  // ── Operasi per BARIS (dipakai halaman keranjang) ─────────────────────────
  setLineQty: (lineKey, qty) =>
    set((state) => ({ items: withQty(state.items, lineKey, qty) })),

  increaseLine: (lineKey) =>
    set((state) => {
      const line = state.items.find((i) => i.lineKey === lineKey);
      if (!line) return state;
      return { items: withQty(state.items, lineKey, line.qty + 1) };
    }),

  decreaseLine: (lineKey) =>
    set((state) => {
      const line = state.items.find((i) => i.lineKey === lineKey);
      if (!line) return state;
      return { items: withQty(state.items, lineKey, line.qty - 1) };
    }),

  removeLine: (lineKey) =>
    set((state) => ({ items: state.items.filter((i) => i.lineKey !== lineKey) })),

  clearCart: () => set({ items: [] }),

  // Total qty sebuah produk di seluruh baris (badge kartu produk).
  getItemQty: (id) =>
    get().items.reduce((sum, i) => (i.id === id ? sum + i.qty : sum), 0),

  getLineQty: (lineKey) => {
    const line = get().items.find((i) => i.lineKey === lineKey);
    return line ? line.qty : 0;
  },

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

  getTotalPrice: () =>
    get().items.reduce((sum, i) => sum + itemUnitPrice(i) * i.qty, 0),
}));

export default useCartStore;

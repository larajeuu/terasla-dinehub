// Penentuan visibilitas & status merchant di sisi pelanggan.
//
// Tiga keadaan yang dibedakan:
//   • TIDAK AKTIF  → status pending/suspended. Merchant & produknya sama sekali
//     tidak ditampilkan ke pelanggan.
//   • BUKA         → status active dan toggle buka/tutup menyala (is_open !== false).
//     Produk tampil & bisa dipesan.
//   • TUTUP        → status active tapi toggle tutup (is_open === false). Merchant
//     tetap tampil di daftar tenant dengan badge "Tutup", produk disembunyikan
//     & pesanan dicegah.
//
// `status` default dianggap active bila field tidak ada (mis. data lama tanpa
// kolom status), dan `is_open` default ke buka — jadi hanya nilai eksplisit yang
// menutup/menyembunyikan.
const hasActiveStatus = (m) => m.status === undefined || m.status === 'active';

// Boleh tampil ke pelanggan sama sekali (lawan: suspended/pending → disembunyikan).
export const isMerchantActive = (m) => !!m && hasActiveStatus(m);

// Buka = aktif DAN sedang buka → produk bisa ditampilkan & dipesan.
export const isMerchantOpen = (m) => isMerchantActive(m) && m.is_open !== false;

// Tutup = aktif tapi toggle tutup. (Suspended/pending bukan "tutup", melainkan
// disembunyikan total — gunakan isMerchantActive untuk membedakannya.)
export const isMerchantClosed = (m) => isMerchantActive(m) && m.is_open === false;

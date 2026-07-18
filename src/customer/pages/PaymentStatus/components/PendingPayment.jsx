import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { formatRupiah } from '../../../../shared/utils/format';

const NOTE_BY_TYPE = {
  qr: 'Scan QR code ini menggunakan aplikasi e-wallet atau m-banking apa pun yang mendukung QRIS.',
  va: 'Transfer tepat sesuai nominal tagihan. Pembayaran yang tidak sesuai tidak akan diproses otomatis.',
  redirect: 'Kamu akan diarahkan ke halaman pembayaran untuk menyelesaikan transaksi.',
  manual: 'Tunjukkan kode pesanan ke kasir dan bayar tunai saat pesanan diantar.',
};

const titleByType = (charge) => {
  if (charge.type === 'va') return 'Bayar dengan Virtual Account';
  if (charge.type === 'manual') return 'Pembayaran Tunai';
  return `Bayar dengan ${charge.method}`;
};

// Hitung mundur dari expires_at. Mengembalikan sisa detik (number) atau null.
const useCountdown = (expiresAt) => {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    if (!expiresAt) return undefined;
    const target = new Date(expiresAt).getTime();
    const tick = () => setLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  return left;
};

// Satu unit waktu (angka 2 digit + label satuan).
const TimeUnit = ({ value, label, color }) => (
  <div className="flex flex-col items-center">
    <span
      className="text-3xl font-bold tabular-nums leading-none"
      style={{ color, fontFamily: "'Poppins', sans-serif" }}
    >
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{label}</span>
  </div>
);

// Tampilan hitung mundur menit:detik dengan label satuan eksplisit agar tidak
// disalahartikan sebagai jam:menit. Warna memerah saat ≤ 60 detik tersisa.
const CountdownDisplay = ({ left }) => {
  if (left == null) return null;

  if (left <= 0) {
    return (
      <div className="my-4 rounded-2xl p-4 text-center" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
        <p className="text-[11px] uppercase tracking-wider text-red-500 font-semibold mb-0.5">Batas Waktu Pembayaran</p>
        <p className="text-base font-bold" style={{ color: '#dc2626', fontFamily: "'Poppins', sans-serif" }}>
          Waktu pembayaran habis
        </p>
      </div>
    );
  }

  const m = Math.floor(left / 60);
  const s = left % 60;
  const urgent = left <= 60;
  const numColor = urgent ? '#dc2626' : '#1D3A27';

  return (
    <div
      className="my-4 rounded-2xl p-4 text-center"
      style={{ background: urgent ? '#fef2f2' : '#f8fafc', border: `1px solid ${urgent ? '#fecaca' : '#e5e7eb'}` }}
    >
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
        Selesaikan pembayaran dalam
      </p>
      <div className="flex items-end justify-center gap-3">
        <TimeUnit value={m} label="Menit" color={numColor} />
        <span className="text-3xl font-bold leading-none pb-4" style={{ color: numColor, fontFamily: "'Poppins', sans-serif" }}>:</span>
        <TimeUnit value={s} label="Detik" color={numColor} />
      </div>
    </div>
  );
};

const QrMiddle = ({ value }) => {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, { width: 280, margin: 1 }).then(setSrc).catch(() => setSrc(null));
  }, [value]);
  return (
    <div className="flex justify-center my-4">
      {src
        ? <img src={src} alt="QR Pembayaran" className="w-44 h-44 rounded-lg" style={{ border: '4px solid #1D3A27' }} />
        : <div className="w-44 h-44 rounded-lg bg-gray-100" />}
    </div>
  );
};

const VaMiddle = ({ charge }) => (
  <div className="my-4 rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)' }}>
    <p className="text-[11px] uppercase tracking-wider opacity-70 mb-1">{charge.bank} Virtual Account</p>
    <p className="text-xl font-bold tracking-wide tabular-nums" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {charge.va_number}
    </p>
    <p className="text-[11px] opacity-70 mt-2">Teras LA Admin · batas.teras.id</p>
  </div>
);

const RedirectMiddle = ({ charge }) => (
  <div className="my-4">
    <a
      href={charge.payment_url || '#'}
      target="_blank"
      rel="noreferrer"
      className="block w-full text-center py-3 rounded-xl text-white text-sm font-bold"
      style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
    >
      Lanjut ke Pembayaran
    </a>
  </div>
);

const ManualMiddle = ({ charge }) => (
  <div className="my-4 rounded-2xl p-4 text-center" style={{ background: '#f1f5f9' }}>
    <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Kode Pesanan</p>
    <p className="text-xl font-bold text-gray-800 tabular-nums" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {charge.order_code}
    </p>
  </div>
);

const Middle = ({ charge }) => {
  if (charge.type === 'qr') return <QrMiddle value={charge.qr_string} />;
  if (charge.type === 'va') return <VaMiddle charge={charge} />;
  if (charge.type === 'redirect') return <RedirectMiddle charge={charge} />;
  return <ManualMiddle charge={charge} />;
};

const PendingPayment = ({ charge, onCheck, onChangeMethod, onSimulate }) => {
  const secondsLeft = useCountdown(charge.expires_at);

  return (
    <div className="bg-white rounded-3xl overflow-hidden mx-auto max-w-sm" style={{ boxShadow: '0 12px 32px -8px rgba(0,0,0,0.3)' }}>
      <div className="px-5 py-4 text-center border-b" style={{ borderColor: '#f1f5f9' }}>
        <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {titleByType(charge)}
        </h2>
      </div>

      <div className="p-5">
        {/* Status */}
        <div className="rounded-2xl p-3 mb-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
          <p className="text-[11px] uppercase tracking-wider text-amber-600 font-semibold">Status Pembayaran</p>
          <p className="text-sm font-bold mt-0.5" style={{ color: '#b45309', fontFamily: "'Poppins', sans-serif" }}>
            Menunggu Pembayaran
          </p>
          <p className="text-[11px] text-amber-700/70 mt-1.5 leading-snug">{NOTE_BY_TYPE[charge.type]}</p>
        </div>

        <Middle charge={charge} />

        {/* Hitung mundur batas pembayaran (menit:detik) */}
        <CountdownDisplay left={secondsLeft} />

        {/* Nominal (rincian fee channel bila dibebankan ke customer) */}
        {charge.fee > 0 && (
          <>
            <div className="flex items-center justify-between py-1.5 border-t" style={{ borderColor: '#f1f5f9' }}>
              <span className="text-xs text-gray-500">Subtotal Pesanan</span>
              <span className="text-xs text-gray-600 tabular-nums">{formatRupiah(charge.subtotal ?? charge.nominal - charge.fee)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-gray-500">Biaya Layanan Pembayaran</span>
              <span className="text-xs text-gray-600 tabular-nums">{formatRupiah(charge.fee)}</span>
            </div>
          </>
        )}
        <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: '#f1f5f9' }}>
          <span className="text-xs text-gray-500">Nominal Transfer</span>
          <span className="text-sm font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
            {formatRupiah(charge.nominal)}
          </span>
        </div>

        {/* Cara bayar */}
        {charge.instructions?.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-700 mb-1.5">Cara Bayar</p>
            <ol className="text-[11px] text-gray-500 space-y-1 list-decimal pl-4">
              {charge.instructions.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        )}
      </div>

      <div className="px-5 pb-5 space-y-2">
        <button
          onClick={onCheck}
          className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all active:scale-[0.98]"
          style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
        >
          Cek Status
        </button>
        <button
          onClick={onChangeMethod}
          className="w-full py-2.5 rounded-xl text-sm font-semibold border"
          style={{ borderColor: '#e5e7eb', color: '#475569' }}
        >
          Ganti Metode
        </button>
        {/* Mode demo (gateway=dummy): pembayaran otomatis dikonfirmasi ±20 detik.
            Saat gateway asli (Tripay) aktif, tombol & teks ini tidak dirender. */}
        {charge.gateway === 'dummy' && (
          <>
            <p className="text-center text-[11px] text-gray-400 pt-1">
              Mode demo — otomatis terbayar dalam ±20 detik
            </p>
            <button
              onClick={onSimulate}
              className="w-full text-[11px] text-gray-400 hover:text-gray-600 underline"
            >
              Bayar sekarang (lewati waktu tunggu)
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingPayment;

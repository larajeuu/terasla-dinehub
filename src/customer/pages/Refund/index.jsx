import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getRefundByOrderHash,
  getRefundEwallets,
  processRefund,
} from '../../../services/refundService';
import { formatRupiah } from '../../../shared/utils/format';

const BRAND = '#1D3A27';

const Refund = () => {
  const { hash } = useParams();
  const navigate = useNavigate();

  const [refund, setRefund] = useState(null);
  const [ewallets, setEwallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [method, setMethod] = useState('');
  const [nomor, setNomor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [r, ew] = await Promise.all([
        getRefundByOrderHash(hash),
        getRefundEwallets().catch(() => []),
      ]);
      setRefund(r);
      setEwallets(ew || []);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal memuat data refund');
    } finally {
      setLoading(false);
    }
  }, [hash]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async () => {
    if (!method) { setSubmitErr('Pilih metode e-wallet dulu.'); return; }
    if (!nomor.trim()) { setSubmitErr('Isi nomor e-wallet tujuan.'); return; }
    setSubmitting(true);
    setSubmitErr(null);
    try {
      setRefund(await processRefund(hash, { metode_refund: method, nomor_tujuan: nomor.trim() }));
    } catch (err) {
      setSubmitErr(err?.response?.data?.detail || 'Gagal memproses refund');
    } finally {
      setSubmitting(false);
    }
  };

  const wrap = (children) => (
    <div className="min-h-screen pb-10" style={{ background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}>
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3.5 bg-white border-b" style={{ borderColor: '#f1f5f9' }}>
        <h1 className="text-base font-bold" style={{ color: BRAND, fontFamily: "'Poppins', sans-serif" }}>
          Pengembalian Dana
        </h1>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  if (loading) return wrap(<p className="text-center text-gray-400 text-sm py-16">Memuat data refund...</p>);

  if (error) {
    return wrap(
      <div className="text-center py-16">
        <p className="text-red-500 text-sm mb-3">{error}</p>
        <button onClick={load} className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: BRAND }}>
          Coba Lagi
        </button>
      </div>
    );
  }

  const done = refund.status === 'disetujui';
  const rejected = refund.status === 'ditolak';
  // Tujuan sudah dikirim tapi transfer manual pengelola belum selesai
  // (mode gateway asli: status tetap pending sampai admin menandai selesai).
  const waiting = refund.status === 'pending' && !!refund.metode_refund && !!refund.nomor_tujuan;

  return wrap(
    <div className="space-y-4">
      {/* Nominal */}
      <div className="bg-white rounded-2xl p-5 border text-center" style={{ borderColor: '#e5e7eb' }}>
        <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Nominal Refund</p>
        <p className="text-3xl font-bold tabular-nums" style={{ color: BRAND, fontFamily: "'Poppins', sans-serif" }}>
          {formatRupiah(refund.nominal)}
        </p>
      </div>

      {rejected && (
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#fecaca', background: '#fef2f2' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#b91c1c', fontFamily: "'Poppins', sans-serif" }}>
            Refund ditolak
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Pengajuan refund ini ditolak pengelola. Silakan hubungi pengelola Teras LA untuk informasi lebih lanjut.
          </p>
        </div>
      )}

      {waiting && (
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#b45309', fontFamily: "'Poppins', sans-serif" }}>
            Refund sedang diproses
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Tujuan refund kamu sudah kami terima: <b>{refund.metode_refund}</b>
            {refund.nomor_tujuan ? ` (${refund.nomor_tujuan})` : ''}. Dana sebesar{' '}
            <b>{formatRupiah(refund.nominal)}</b> akan dikirim oleh pengelola. Kamu akan
            dihubungi bila ada kendala.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 py-3 rounded-2xl text-white text-sm font-bold"
            style={{ background: BRAND, fontFamily: "'Poppins', sans-serif" }}
          >
            Kembali ke Beranda
          </button>
        </div>
      )}

      {done && (
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#15803d', fontFamily: "'Poppins', sans-serif" }}>
            ✓ Refund sudah diproses
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Dana dikembalikan ke <b>{refund.metode_refund}</b>
            {refund.nomor_tujuan ? ` (${refund.nomor_tujuan})` : ''}. Terima kasih.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 py-3 rounded-2xl text-white text-sm font-bold"
            style={{ background: BRAND, fontFamily: "'Poppins', sans-serif" }}
          >
            Kembali ke Beranda
          </button>
        </div>
      )}

      {/* Form pilih tujuan — hanya saat refund masih pending & tujuan belum dikirim */}
      {!done && !waiting && !rejected && (
        <>
          <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e5e7eb' }}>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Pilih E-Wallet</p>
            <div className="grid grid-cols-2 gap-2.5">
              {ewallets.map((ew) => {
                const active = method === ew;
                return (
                  <button
                    key={ew}
                    onClick={() => setMethod(ew)}
                    className="py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
                    style={{
                      background: active ? BRAND : 'white',
                      color: active ? 'white' : '#374151',
                      border: `1px solid ${active ? BRAND : '#e5e7eb'}`,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {ew}
                  </button>
                );
              })}
            </div>

            <label className="block mt-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nomor E-Wallet Tujuan</span>
              <input
                type="tel"
                value={nomor}
                onChange={(e) => setNomor(e.target.value)}
                placeholder="08xx-xxxx-xxxx"
                className="mt-1.5 w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: '1px solid #e5e7eb', color: '#374151' }}
              />
            </label>
          </div>

          {submitErr && (
            <p className="text-xs text-red-500 text-center">{submitErr}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl text-white text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: BRAND, fontFamily: "'Poppins', sans-serif" }}
          >
            {submitting ? 'Memproses...' : 'Proses Refund Sekarang'}
          </button>
          <p className="text-[11px] text-gray-400 text-center leading-relaxed px-4">
            Setelah tujuan dikirim, pengembalian dana diproses oleh pengelola ke
            e-wallet yang kamu pilih.
          </p>
        </>
      )}
    </div>
  );
};

export default Refund;

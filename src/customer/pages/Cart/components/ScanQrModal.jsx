import { useEffect, useRef, useState } from 'react';
import { CameraIcon, CloseIcon } from '../../../../shared/components/icons';

const TUTORIAL_STEPS = [
  {
    n: 1,
    title: 'Klik "Lanjut" di bawah',
    desc: 'Browser akan menampilkan dialog izin kamera.',
  },
  {
    n: 2,
    title: 'Pilih "Izinkan" / "Allow"',
    desc: 'Biasanya muncul di bagian atas atau bawah layar.',
  },
  {
    n: 3,
    title: 'Arahkan ke QR meja',
    desc: 'Pastikan QR berada di dalam bingkai kamera.',
  },
];

const ScanQrModal = ({ open, onClose }) => {
  const [step, setStep] = useState('tutorial');
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setStep('tutorial');
    } else if (mounted) {
      setShown(false);
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted || !open) return;
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [mounted, open]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (!open) stopStream();
    return stopStream;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const requestCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStep('unsupported');
      return;
    }
    setStep('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setStep('streaming');
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch (err) {
      if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') {
        setStep('denied');
      } else {
        setStep('error');
      }
    }
  };

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.55)', opacity: shown ? 1 : 0 }}
      />

      <div
        className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden transition-all duration-200"
        style={{
          transform: shown ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
          opacity: shown ? 1 : 0,
          boxShadow: '0 24px 60px -12px rgba(0,0,0,0.4)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Tutup"
        >
          <CloseIcon size={16} />
        </button>

        {(step === 'tutorial' || step === 'requesting') && (
          <div className="px-6 pt-7 pb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{
                background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
                boxShadow: '0 6px 14px -4px rgba(29,58,39,0.4)',
              }}
            >
              <CameraIcon size={22} color="white" />
            </div>
            <h2
              className="text-base font-bold text-gray-900 leading-snug"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Scan QR di meja kamu
            </h2>
            <p
              className="text-xs text-gray-500 mt-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Kami butuh izin kamera supaya bisa membaca QR meja. Ikuti langkah
              singkat berikut:
            </p>

            <ol className="mt-5 space-y-3">
              {TUTORIAL_STEPS.map((s) => (
                <li key={s.n} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                    style={{
                      background:
                        'linear-gradient(135deg, #d6a425 0%, #C8961A 100%)',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {s.n}
                  </span>
                  <div className="flex-1">
                    <p
                      className="text-[13px] font-semibold text-gray-800 leading-snug"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {s.title}
                    </p>
                    <p
                      className="text-[11.5px] text-gray-500 mt-0.5 leading-snug"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={requestCamera}
                disabled={step === 'requesting'}
                className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-70 disabled:cursor-wait"
                style={{
                  background:
                    'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
                  boxShadow: '0 6px 16px -4px rgba(29,58,39,0.4)',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {step === 'requesting'
                  ? 'Meminta izin kamera…'
                  : 'Lanjut & Izinkan Kamera'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {step === 'streaming' && (
          <div className="flex flex-col">
            <div
              className="relative w-full bg-black"
              style={{ aspectRatio: '1 / 1' }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className="w-56 h-56 rounded-2xl"
                  style={{
                    border: '3px solid rgba(200,150,26,0.95)',
                    boxShadow:
                      '0 0 0 9999px rgba(0,0,0,0.4), 0 0 18px rgba(200,150,26,0.45)',
                  }}
                />
              </div>
            </div>
            <div className="px-6 py-4 text-center">
              <p
                className="text-[13px] font-semibold text-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Arahkan kamera ke QR meja
              </p>
              <p
                className="text-[11.5px] text-gray-500 mt-0.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Pastikan QR berada di dalam bingkai emas.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {(step === 'denied' || step === 'error' || step === 'unsupported') && (
          <div className="px-6 pt-7 pb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: '#fef2f2' }}
            >
              <CameraIcon size={22} color="#b91c1c" />
            </div>
            <h2
              className="text-base font-bold text-gray-900 leading-snug"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {step === 'denied'
                ? 'Izin kamera ditolak'
                : step === 'unsupported'
                ? 'Kamera tidak didukung'
                : 'Tidak bisa membuka kamera'}
            </h2>
            <p
              className="text-xs text-gray-500 mt-1 leading-snug"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {step === 'denied'
                ? 'Buka pengaturan situs di browser kamu, aktifkan izin kamera untuk halaman ini, lalu coba lagi.'
                : step === 'unsupported'
                ? 'Browser kamu tidak mendukung akses kamera. Coba buka halaman ini di Chrome atau Safari versi terbaru.'
                : 'Terjadi masalah saat mengakses kamera. Pastikan tidak ada aplikasi lain yang sedang memakai kamera.'}
            </p>

            <div className="mt-5 space-y-2">
              {step !== 'unsupported' && (
                <button
                  type="button"
                  onClick={requestCamera}
                  className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] hover:brightness-110"
                  style={{
                    background:
                      'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
                    boxShadow: '0 6px 16px -4px rgba(29,58,39,0.4)',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Coba Lagi
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQrModal;

const ConfirmLogoutModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 32px',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 999, background: '#e5e7eb', margin: '0 auto' }} />

        {/* Ikon + teks */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '4px 0 8px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            🔓
          </div>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: '#1f2937', margin: 0 }}>
            Keluar dari Akun?
          </p>
          <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', margin: 0 }}>
            Kamu akan keluar dari sesi ini. Masuk lagi kapan saja.
          </p>
        </div>

        {/* Tombol konfirmasi */}
        <button
          onClick={onConfirm}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: 16,
            border: 'none',
            background: '#dc2626',
            color: 'white',
            fontFamily: "'Poppins', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Ya, Keluar
        </button>

        {/* Tombol batal */}
        <button
          onClick={onCancel}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 16,
            border: 'none',
            background: '#f3f4f6',
            color: '#374151',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
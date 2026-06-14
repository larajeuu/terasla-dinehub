import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSection from "./components/LanguageSection";
import LogoutSection from "./components/LogoutSection";

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f5f0',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px',
    background: '#1D3A27',
  },
  btnBack: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  headerTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: 'white',
    margin: 0,
  },
  content: {
    flex: 1,
    padding: '16px 16px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    overflowY: 'auto',
  },
  // Tombol "Edit Profil" — row item seperti menu setting pada umumnya
  profileRow: {
    background: 'white',
    borderRadius: 20,
    padding: '16px 20px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 11,
    color: '#d1d5db',
    margin: '4px 0 0',
    fontFamily: "'Inter', sans-serif",
  },
  toast: {
    position: 'fixed',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1D3A27',
    color: 'white',
    padding: '12px 24px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 20px rgba(29,58,39,0.35)',
    zIndex: 100,
  },
};

export default function Settings() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <button
          style={styles.btnBack}
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={styles.headerTitle}>Pengaturan</h1>
      </header>

      {/* Konten */}
      <main style={styles.content}>

        {/* Tombol Edit Profil → navigate ke /merchant/profile */}
        <button
          style={styles.profileRow}
          onClick={() => navigate('/merchant/profile')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>👤</span>
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: '#1f2937', margin: '0 0 2px' }}>
                Edit Profil
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                Ubah informasi toko dan akun kamu
              </p>
            </div>
          </div>
          {/* Chevron kanan */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <LanguageSection />
        <LogoutSection />

        <p style={styles.appVersion}>TerasLA DineHub v1.0.0</p>
      </main>

      {toast && (
        <div style={styles.toast} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}
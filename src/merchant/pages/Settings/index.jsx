import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSection from "./components/LanguageSection";
import LogoutSection from "./components/LogoutSection";
import useAuthStore from "../../../store/authStore";
import { getMerchantById } from '../../../services/merchantService';
import BottomNavbar from "../../components/BottomNavbar";

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
  profileCard: {
    background: 'white',
    borderRadius: 20,
    padding: '16px 20px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  profileCardAvatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: '#e8f5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0,
  },
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
  const user = useAuthStore((s) => s.user);
  const [merchant, setMerchant] = useState(null);
  const [loadingMerchant, setLoadingMerchant] = useState(true);

  useEffect(() => {
    if (!user?.merchantId) return;
    getMerchantById(user.merchantId)
      .then((data) => setMerchant(data))
      .catch(() => {})
      .finally(() => setLoadingMerchant(false));
  }, [user?.merchantId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Pengaturan</h1>
      </header>

      {/* Konten */}
      <main style={styles.content}>

        {/* Ringkasan Profil dari API */}
        {loadingMerchant ? (
          <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 13, color: '#9ca3af' }}>
            Memuat profil...
          </div>
        ) : merchant ? (
          <div style={styles.profileCard}>
            <div style={styles.profileCardAvatar}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z" stroke="#2d5a27" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9 21v-8h6v8" stroke="#2d5a27" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: '#1f2937', margin: '0 0 2px' }}>
                {merchant.name || user?.name || '-'}
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                {[merchant.block, merchant.category].filter(Boolean).join(' · ') || 'Informasi toko'}
              </p>
            </div>
          </div>
        ) : null}
        <button
          style={styles.profileRow}
          onClick={() => navigate('/merchant/profile')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#2d5a27" strokeWidth="1.8"/>
                <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="#2d5a27" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
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

      <BottomNavbar />
    </div>
  );
}
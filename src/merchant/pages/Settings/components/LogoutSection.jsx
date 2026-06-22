import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../../store/authStore";
import ConfirmLogoutModal from "./ConfirmLogoutModal";

export default function LogoutSection() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogoutConfirm = () => {
    logout();
    navigate("/merchant/login", { replace: true });
  };

  return (
    <>
      <section
        style={{
          background: 'white',
          borderRadius: 20,
          padding: '16px 20px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        {/* Info logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: '#1f2937', margin: '0 0 2px' }}>
              Keluar dari Akun
            </p>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
              Sesi kamu akan diakhiri
            </p>
          </div>
        </div>

        {/* Tombol logout */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            padding: '9px 18px',
            borderRadius: 12,
            border: '1.5px solid #dc2626',
            background: 'transparent',
            color: '#dc2626',
            fontFamily: "'Poppins', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Logout
        </button>
      </section>

      <ConfirmLogoutModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
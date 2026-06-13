import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmLogoutModal from "./ConfirmLogoutModal";

export default function LogoutSection() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    // TODO: tambahkan key lain jika ada, misal: "dineHub_user", "dineHub_merchantId"
    navigate("/login", { replace: true });
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
          <span style={{ fontSize: 22 }}>🔓</span>
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
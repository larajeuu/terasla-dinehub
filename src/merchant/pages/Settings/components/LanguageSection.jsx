import { useState } from "react";

const LANGUAGES = [
  { code: "id", label: "Indonesia", sub: "Bahasa Indonesia", flagSrc: "https://flagcdn.com/w40/id.png" },
  { code: "en", label: "English",   sub: "English (US)",     flagSrc: "https://flagcdn.com/w40/us.png" },
];

const getSavedLang = () => localStorage.getItem("dineHub_lang") || "id";

export default function LanguageSection() {
  const [activeLang, setActiveLang] = useState(getSavedLang);

  const handleSelect = (code) => {
    setActiveLang(code);
    localStorage.setItem("dineHub_lang", code);
  };

  return (
    <section
      style={{
        background: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid #f3f4f6' }}>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: '#1f2937', margin: 0 }}>
          Bahasa
        </p>
      </div>

      {LANGUAGES.map(({ code, label, sub, flagSrc }, i) => {
        const isActive = activeLang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => handleSelect(code)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '13px 20px',
              background: 'white',
              border: 'none',
              borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <img
              src={flagSrc}
              alt={label}
              style={{ width: 28, height: 19, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: isActive ? 600 : 400, color: '#1f2937', margin: 0 }}>
                {label}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#9ca3af', margin: '1px 0 0' }}>
                {sub}
              </p>
            </div>
            {/* Radio indicator — ukuran tetap agar tidak ada layout shift */}
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: isActive ? '2px solid #1D3A27' : '2px solid #d1d5db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'border-color 0.15s',
              }}
            >
              {isActive && (
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D3A27' }} />
              )}
            </div>
          </button>
        );
      })}
    </section>
  );
}
import { useState } from "react";

const LANGUAGES = [
  { code: "id", label: "Indonesia", flagSrc: "https://flagcdn.com/w40/id.png" },
  { code: "en", label: "English",   flagSrc: "https://flagcdn.com/w40/us.png" },
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
        padding: 20,
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: '#1a3a14', margin: '0 0 4px' }}>
        Bahasa
      </h2>
      <p style={{ fontSize: 12, color: '#9ab095', margin: '0 0 16px' }}>
        Pilih bahasa tampilan aplikasi
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        {LANGUAGES.map(({ code, label, flagSrc }) => {
          const isActive = activeLang === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              aria-pressed={isActive}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 14,
                border: isActive ? '1.5px solid #2d5a27' : '1.5px solid #e5e7eb',
                background: isActive ? '#f0f7ee' : '#f9fafb',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.15s ease',
              }}
            >
              <img src={flagSrc} alt={label} style={{ width: 24, height: 16, objectFit: 'cover', borderRadius: 2 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? '#1D3A27' : '#374151' }}>
                {label}
              </span>
              {isActive && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#2d5a27', marginLeft: 'auto' }}>
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
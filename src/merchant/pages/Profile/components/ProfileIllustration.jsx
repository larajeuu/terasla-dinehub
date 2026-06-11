import { useRef } from 'react';

const ProfileIllustration = ({ photoSrc, onPhotoChange }) => {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onPhotoChange) {
      const url = URL.createObjectURL(file);
      onPhotoChange(url);
    }
  };

  return (
    <div className="flex flex-col items-center py-6 gap-2">
      {/* Photo */}
      <div
        className="w-24 h-24 rounded-full overflow-hidden"
        style={{ border: '3px solid #2d5a27' }}
      >
        {photoSrc ? (
          <img src={photoSrc} alt="Foto Profil" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: '#e8f0e5' }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="18" r="10" fill="#2d5a27" opacity="0.3" />
              <path d="M6 42c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="#2d5a27" opacity="0.3" />
            </svg>
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color: '#9ab095' }}>
        Format: JPG, PNG. Maks. 2MB
      </p>

      <button
        onClick={() => fileRef.current.click()}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold"
        style={{
          border: '1.5px solid #2d5a27',
          color: '#2d5a27',
          background: '#ffffff',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M3 17h14M12.5 3.5l3 3-8 8H4.5v-3l8-8z" stroke="#2d5a27" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Ubah Foto
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileIllustration;
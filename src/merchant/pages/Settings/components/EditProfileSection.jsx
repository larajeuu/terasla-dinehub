import { useState } from 'react';
import ProfileIllustration from '../../Profile/components/ProfileIllustration';
import ProfileActions from '../../Profile/components/ProfileActions';

const EditProfileSection = ({ onShowToast }) => {
  const [photo, setPhoto] = useState(null);

  const handleSave = () => {
    if (onShowToast) onShowToast('✓ Profil berhasil diperbarui!');
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
      <div style={{ padding: '20px 20px 0' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: '#1a3a14', margin: '0 0 4px' }}>
          Edit Profil
        </h2>
        <p style={{ fontSize: 12, color: '#9ab095', margin: 0 }}>
          Ubah informasi toko dan akun kamu
        </p>
      </div>

      <ProfileIllustration photoSrc={photo} onPhotoChange={setPhoto} />
      <ProfileActions onSave={handleSave} />
    </section>
  );
};

export default EditProfileSection;
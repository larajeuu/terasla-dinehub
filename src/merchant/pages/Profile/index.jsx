import ProfileHeader from './components/ProfileHeader';
import ProfileActions from './components/ProfileActions';

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f0' }}>
      <ProfileHeader />
      <div className="flex-1 px-4 pb-8">
        {/* ProfileActions merender foto (ProfileIllustration) + form sekaligus,
            agar file foto yang dipilih ikut tersimpan saat menekan Simpan. */}
        <ProfileActions />
      </div>
    </div>
  );
};

export default ProfilePage;
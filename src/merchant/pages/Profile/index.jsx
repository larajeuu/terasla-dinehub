import ProfileHeader from './components/ProfileHeader';
import ProfileIllustration from './components/ProfileIllustration';
import ProfileActions from './components/ProfileActions';

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f0' }}>
      <ProfileHeader />
      <div className="flex-1 px-4 pb-8">
        <ProfileIllustration />
        <ProfileActions />
      </div>
    </div>
  );
};

export default ProfilePage;
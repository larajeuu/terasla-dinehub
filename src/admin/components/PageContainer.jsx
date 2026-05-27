import { useOutletContext } from 'react-router-dom';
import AdminTopBar from './AdminTopBar';

const PageContainer = ({ title, subtitle, actions, children }) => {
  const ctx = useOutletContext();
  return (
    <>
      <AdminTopBar
        title={title}
        subtitle={subtitle}
        actions={actions}
        onMenuClick={ctx?.openSidebar}
      />
      <div className="flex-1 p-6 overflow-x-hidden">{children}</div>
    </>
  );
};

export default PageContainer;

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content Area - With left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 ml-20 lg:ml-64 xl:ml-72">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

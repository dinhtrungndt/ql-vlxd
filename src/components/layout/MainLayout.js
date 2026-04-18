import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0F1C]">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 opacity-30 blur-[120px]"></div>

        <Header onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 z-10 relative">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

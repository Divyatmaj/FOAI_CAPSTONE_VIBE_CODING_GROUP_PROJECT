import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children, onSettings }) => (
  <div className="flex min-h-screen bg-bg font-body text-ink">
    <Sidebar onSettings={onSettings} />
    <div className="flex-1 flex flex-col lg:ml-[280px]">
      <Topbar onSettings={onSettings} />
      <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  </div>
);

export default Layout;

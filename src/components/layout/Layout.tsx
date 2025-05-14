
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Get the current page title based on the URL path
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/employees') return 'Employees';
    if (path.startsWith('/employees/')) return 'Employee Details';
    if (path === '/departments') return 'Departments';
    if (path.startsWith('/departments/')) return 'Department Details';
    if (path === '/availability') return 'Availability Calendar';
    
    return 'HR Management System';
  };
  
  return (
    <div className="hr-layout">
      <Sidebar />
      <div className="flex flex-col">
        <Header title={getPageTitle()} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

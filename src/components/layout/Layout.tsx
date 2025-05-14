
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Header from './Header';

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header title={getPageTitle()} />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

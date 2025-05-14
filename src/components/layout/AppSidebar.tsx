
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboardIcon, 
  UsersIcon, 
  FolderIcon, 
  CalendarIcon,
  SettingsIcon 
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const location = useLocation();
  
  // Menu items
  const menuItems = [
    { path: '/', icon: LayoutDashboardIcon, label: 'Dashboard' },
    { path: '/employees', icon: UsersIcon, label: 'Employees' },
    { path: '/departments', icon: FolderIcon, label: 'Departments' },
    { path: '/availability', icon: CalendarIcon, label: 'Availability' }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="rounded-md bg-hr-primary p-1">
            <UsersIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-sidebar-foreground">HR Portal</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  <Link to={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p>HR Management System</p>
            <p className="opacity-70">v1.0.0</p>
          </div>
          <SettingsIcon className="h-4 w-4 opacity-70" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon, LayoutDashboardIcon, CalendarIcon, FolderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  expanded: boolean;
};

const NavItem = ({ to, icon: Icon, label, expanded }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center px-3 py-2 mb-1 rounded-md transition-colors',
        isActive
          ? 'bg-hr-primary text-white'
          : 'hover:bg-hr-light hover:text-hr-primary text-slate-700'
      )}
    >
      <Icon className="h-5 w-5" />
      {expanded && <span className="ml-3">{label}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={cn(
        'h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col',
        expanded ? 'w-56' : 'w-16'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {expanded ? (
          <h1 className="text-hr-primary font-bold text-xl">HR Portal</h1>
        ) : (
          <span className="text-hr-primary font-bold text-xl mx-auto">HR</span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-1"
        >
          {expanded ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-3">
        <NavItem
          to="/"
          icon={LayoutDashboardIcon}
          label="Dashboard"
          expanded={expanded}
        />
        <NavItem
          to="/employees"
          icon={UsersIcon}
          label="Employees"
          expanded={expanded}
        />
        <NavItem
          to="/departments"
          icon={FolderIcon}
          label="Departments"
          expanded={expanded}
        />
        <NavItem
          to="/availability"
          icon={CalendarIcon}
          label="Availability"
          expanded={expanded}
        />
      </nav>
      
      <div className="p-3 border-t border-slate-200">
        {expanded ? (
          <div className="text-xs text-slate-500">
            <p>HR Management System</p>
            <p>v1.0.0</p>
          </div>
        ) : (
          <div className="text-center text-xs text-slate-500">v1</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

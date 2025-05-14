
import React from 'react';
import { useHR } from '@/context/HRContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, FolderIcon, CheckCircleIcon, AlertCircleIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  className = ""
}: { 
  title: string; 
  value: number | string; 
  description?: string; 
  icon: React.ElementType;
  className?: string;
}) => (
  <Card className={`overflow-hidden ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="rounded-full bg-hr-light p-2">
        <Icon className="h-4 w-4 text-hr-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { employees, departments, availabilityEntries } = useHR();
  
  // Calculate some stats
  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const availableToday = availabilityEntries.filter(
    entry => entry.status === 'available' && 
    new Date(entry.date).toDateString() === new Date().toDateString()
  ).length;
  const unavailableToday = availabilityEntries.filter(
    entry => entry.status === 'unavailable' && 
    new Date(entry.date).toDateString() === new Date().toDateString()
  ).length;
  
  // Calculate employees without departments
  const unassignedEmployees = employees.filter(emp => !emp.departmentId).length;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Employees" 
          value={totalEmployees} 
          icon={UserIcon} 
        />
        <StatCard 
          title="Departments" 
          value={totalDepartments} 
          icon={FolderIcon} 
        />
        <StatCard 
          title="Available Today" 
          value={availableToday} 
          icon={CheckCircleIcon} 
          description={`Out of ${totalEmployees} employees`}
        />
        <StatCard 
          title="Unavailable Today" 
          value={unavailableToday} 
          icon={AlertCircleIcon} 
          description={`Out of ${totalEmployees} employees`}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Employee distribution across departments</CardDescription>
              </div>
              <TrendingUpIcon className="h-4 w-4 text-hr-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map(dept => {
                const deptEmployees = employees.filter(emp => emp.departmentId === dept.id).length;
                const percentage = totalEmployees ? Math.round((deptEmployees / totalEmployees) * 100) : 0;
                
                return (
                  <div key={dept.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dept.name}</span>
                      <span className="text-sm text-muted-foreground">{deptEmployees} employees</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-hr-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              
              {unassignedEmployees > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Unassigned</span>
                    <span className="text-sm text-muted-foreground">{unassignedEmployees} employees</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground rounded-full"
                      style={{ width: `${(unassignedEmployees / totalEmployees) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Availability Overview</CardTitle>
                <CardDescription>Today's employee availability</CardDescription>
              </div>
              <CalendarIcon className="h-4 w-4 text-hr-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-60">
              {availableToday + unavailableToday > 0 ? (
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-36 h-36 -rotate-90">
                    <circle
                      className="text-muted"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                      r="60"
                      cx="72"
                      cy="72"
                    />
                    <circle
                      className="text-hr-primary"
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={
                        2 * Math.PI * 60 * (1 - availableToday / (availableToday + unavailableToday))
                      }
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="60"
                      cx="72"
                      cy="72"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold flex items-center rotate-90">
                    {Math.round((availableToday / (availableToday + unavailableToday)) * 100)}%
                  </span>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-muted" />
                  <p>No availability data for today</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-hr-primary mr-2" />
                <span className="text-sm">Available ({availableToday})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-muted mr-2" />
                <span className="text-sm">Unavailable ({unavailableToday})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

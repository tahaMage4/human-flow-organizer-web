
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHR } from '@/context/HRContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, UserIcon, Trash2Icon, PencilIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getEmployeeById, 
    getDepartmentById, 
    departments, 
    updateEmployee, 
    removeEmployee,
    getAvailabilityForEmployee
  } = useHR();
  const { toast } = useToast();
  
  const employee = getEmployeeById(id!);
  const department = employee?.departmentId ? getDepartmentById(employee.departmentId) : null;
  const employeeAvailability = getAvailabilityForEmployee(id!);
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(employee?.departmentId || undefined);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-xl text-slate-600 mb-4">Employee not found</div>
        <Button onClick={() => navigate('/employees')}>Back to Employees</Button>
      </div>
    );
  }

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
  };

  const handleSaveChanges = () => {
    updateEmployee(employee.id, {
      departmentId: selectedDepartment || null,
    });
    
    setIsEditing(false);
    toast({
      title: 'Changes saved',
      description: 'Employee information has been updated.',
    });
  };

  const handleDeleteEmployee = () => {
    removeEmployee(employee.id);
    toast({
      title: 'Employee removed',
      description: 'The employee has been removed from the system.',
    });
    navigate('/employees');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{employee.name}</h2>
          <p className="text-slate-500">{employee.position}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : <><PencilIcon className="h-4 w-4 mr-2" /> Edit</>}
          </Button>
          
          {isEditing ? (
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2Icon className="h-4 w-4 mr-2" /> Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove {employee.name} from the system. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteEmployee} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-hr-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-500">Full Name</div>
                    <div>{employee.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-500">Email</div>
                    <div>{employee.email}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-500">Phone</div>
                    <div>{employee.phone || 'Not provided'}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-500">Hire Date</div>
                    <div>{employee.hireDate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-hr-primary" />
                  Department
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-2">Department Assignment</div>
                    <Select
                      value={selectedDepartment}
                      onValueChange={handleDepartmentChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="text-sm font-medium text-slate-500">Current Department</div>
                      <div className="mt-1">
                        {department ? (
                          <Badge className="bg-hr-highlight text-hr-secondary border-hr-light">
                            {department.name}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">
                            Unassigned
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {department && (
                      <>
                        <div>
                          <div className="text-sm font-medium text-slate-500">Department Description</div>
                          <div>{department.description}</div>
                        </div>
                        
                        {department.managerEmployeeId && (
                          <div>
                            <div className="text-sm font-medium text-slate-500">Department Manager</div>
                            <div>{getEmployeeById(department.managerEmployeeId)?.name || 'Unknown'}</div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="availability" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {employeeAvailability.length > 0 ? (
                <div className="space-y-4">
                  {employeeAvailability.map((entry) => (
                    <div key={entry.id} className="flex items-center p-3 border rounded-md">
                      <div className={`w-3 h-3 rounded-full mr-3 ${entry.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div className="flex-1">
                        <div className="font-medium">
                          {format(new Date(entry.date), 'PPPP')}
                        </div>
                        <div className="text-sm text-slate-500">
                          {entry.startTime} - {entry.endTime}
                        </div>
                      </div>
                      <Badge variant={entry.status === 'available' ? 'default' : 'destructive'}>
                        {entry.status === 'available' ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No availability records found for this employee.</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/availability')}>
                    Schedule Availability
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetails;

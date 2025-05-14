
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHR } from '@/context/HRContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UsersIcon, FolderIcon, Trash2Icon, PencilIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';

const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getDepartmentById, 
    getEmployeesByDepartment,
    getEmployeeById,
    updateDepartment, 
    removeDepartment,
    employees
  } = useHR();
  const { toast } = useToast();
  
  const department = getDepartmentById(id!);
  const departmentEmployees = department ? getEmployeesByDepartment(department.id) : [];
  const manager = department?.managerEmployeeId 
    ? getEmployeeById(department.managerEmployeeId) 
    : undefined;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: department?.name || '',
    description: department?.description || '',
    managerEmployeeId: department?.managerEmployeeId || undefined,
  });

  if (!department) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-xl text-slate-600 mb-4">Department not found</div>
        <Button onClick={() => navigate('/departments')}>Back to Departments</Button>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormState({
      ...formState,
      [field]: value,
    });
  };

  const handleSaveChanges = () => {
    updateDepartment(department.id, {
      name: formState.name,
      description: formState.description,
      managerEmployeeId: formState.managerEmployeeId,
    });
    
    setIsEditing(false);
    toast({
      title: 'Changes saved',
      description: 'Department information has been updated.',
    });
  };

  const handleDeleteDepartment = () => {
    removeDepartment(department.id);
    toast({
      title: 'Department removed',
      description: 'The department has been removed from the system.',
    });
    navigate('/departments');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{department.name}</h2>
          {!isEditing && <p className="text-slate-500">{departmentEmployees.length} employees</p>}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={isEditing ? "outline" : "default"}
            onClick={() => {
              if (isEditing) {
                setFormState({
                  name: department.name,
                  description: department.description,
                  managerEmployeeId: department.managerEmployeeId,
                });
              }
              setIsEditing(!isEditing);
            }}
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
                    This will permanently remove the {department.name} department from the system. 
                    All employees will be unassigned from this department. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteDepartment} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FolderIcon className="h-5 w-5 mr-2 text-hr-primary" />
                Department Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1 block">Department Name</label>
                    <Input 
                      value={formState.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1 block">Description</label>
                    <Textarea 
                      value={formState.description} 
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1 block">Department Manager</label>
                    <Select
                      value={formState.managerEmployeeId}
                      onValueChange={(value) => handleInputChange('managerEmployeeId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="text-sm font-medium text-slate-500">Description</div>
                    <div>{department.description}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-500">Department Manager</div>
                    <div>
                      {manager ? (
                        <Link to={`/employees/${manager.id}`} className="text-hr-primary hover:underline">
                          {manager.name}
                        </Link>
                      ) : (
                        <span className="text-slate-400">No manager assigned</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-500">Number of Employees</div>
                    <div>{departmentEmployees.length}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <UsersIcon className="h-5 w-5 mr-2 text-hr-primary" />
                Department Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {departmentEmployees.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`/employees/${employee.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <UsersIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No employees assigned to this department yet.</p>
                  <Link to="/employees">
                    <Button variant="outline" className="mt-4">
                      Manage Employees
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;

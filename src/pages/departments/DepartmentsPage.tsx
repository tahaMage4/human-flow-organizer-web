
import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, FolderPlusIcon, UsersIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import AddDepartmentForm from './AddDepartmentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DepartmentsPage = () => {
  const { departments, getEmployeesByDepartment, getEmployeeById } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDepartmentAdded = () => {
    setIsAddDialogOpen(false);
    toast({
      title: 'Department added successfully',
      description: 'The new department has been added to the system.',
    });
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search departments..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <FolderPlusIcon className="mr-2 h-4 w-4" /> Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <AddDepartmentForm onSuccess={handleDepartmentAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((department) => {
            const departmentEmployees = getEmployeesByDepartment(department.id);
            const manager = department.managerEmployeeId
              ? getEmployeeById(department.managerEmployeeId)
              : null;

            return (
              <Card key={department.id} className="overflow-hidden">
                <CardHeader className="bg-hr-light pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>{department.name}</span>
                    <Link to={`/departments/${department.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-3 text-sm">{department.description}</div>
                  
                  <div className="flex items-center text-sm text-slate-600 mb-2">
                    <UsersIcon className="h-4 w-4 mr-2 text-hr-primary" />
                    <span>{departmentEmployees.length} employees</span>
                  </div>
                  
                  {manager && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Manager:</span> {manager.name}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-md shadow p-8 text-center">
          <FolderPlusIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No departments found</h3>
          <p className="text-slate-500 mb-4">
            {searchTerm
              ? "No departments match your search. Try adjusting your search terms."
              : "Get started by creating your first department."}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Department
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;

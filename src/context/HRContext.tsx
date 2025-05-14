
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { format, isSameDay } from 'date-fns';

export type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
  departmentId: string | null;
  phone?: string;
  hireDate: string;
};

export type Department = {
  id: string;
  name: string;
  description: string;
  managerEmployeeId?: string;
};

export type AvailabilityEntry = {
  id: string;
  employeeId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'available' | 'unavailable';
  note?: string;
};

type HRContextType = {
  employees: Employee[];
  departments: Department[];
  availabilityEntries: AvailabilityEntry[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  removeDepartment: (id: string) => void;
  getEmployeesByDepartment: (departmentId: string) => Employee[];
  getDepartmentById: (id: string) => Department | undefined;
  getEmployeeById: (id: string) => Employee | undefined;
  addAvailability: (availability: Omit<AvailabilityEntry, 'id'>) => void;
  updateAvailability: (id: string, availability: Partial<AvailabilityEntry>) => void;
  removeAvailability: (id: string) => void;
  getAvailabilityForEmployee: (employeeId: string) => AvailabilityEntry[];
  getAvailabilityForDate: (date: Date) => AvailabilityEntry[];
};

const HRContext = createContext<HRContextType | undefined>(undefined);

// Sample initial data
const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    position: 'Software Engineer',
    departmentId: '1',
    hireDate: '2020-01-15',
    phone: '555-123-4567',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    position: 'Product Manager',
    departmentId: '2',
    hireDate: '2019-05-10',
    phone: '555-987-6543',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.j@company.com',
    position: 'UX Designer',
    departmentId: '3',
    hireDate: '2021-03-22',
    phone: '555-456-7890',
  },
];

const initialDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development department',
    managerEmployeeId: '1',
  },
  {
    id: '2',
    name: 'Product',
    description: 'Product management department',
    managerEmployeeId: '2',
  },
  {
    id: '3',
    name: 'Design',
    description: 'User experience and design department',
    managerEmployeeId: '3',
  },
];

const today = new Date();
const initialAvailability: AvailabilityEntry[] = [
  {
    id: '1',
    employeeId: '1',
    date: today,
    startTime: '09:00',
    endTime: '17:00',
    status: 'available',
  },
  {
    id: '2',
    employeeId: '2',
    date: today,
    startTime: '10:00',
    endTime: '18:00',
    status: 'available',
  },
  {
    id: '3',
    employeeId: '3',
    date: today,
    startTime: '08:00',
    endTime: '16:00',
    status: 'unavailable',
    note: 'Vacation',
  },
];

export const HRProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [availabilityEntries, setAvailabilityEntries] = useState<AvailabilityEntry[]>(initialAvailability);

  // Employee functions
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, employee: Partial<Employee>) => {
    setEmployees(
      employees.map((e) => (e.id === id ? { ...e, ...employee } : e))
    );
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
    // Also remove employee from department manager positions
    setDepartments(
      departments.map((dept) =>
        dept.managerEmployeeId === id
          ? { ...dept, managerEmployeeId: undefined }
          : dept
      )
    );
    // Remove availability entries for this employee
    setAvailabilityEntries(
      availabilityEntries.filter((a) => a.employeeId !== id)
    );
  };

  // Department functions
  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newDepartment = {
      ...department,
      id: Date.now().toString(),
    };
    setDepartments([...departments, newDepartment]);
  };

  const updateDepartment = (id: string, department: Partial<Department>) => {
    setDepartments(
      departments.map((d) => (d.id === id ? { ...d, ...department } : d))
    );
  };

  const removeDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
    // Clear department assignment for employees in this department
    setEmployees(
      employees.map((emp) =>
        emp.departmentId === id ? { ...emp, departmentId: null } : emp
      )
    );
  };

  const getEmployeesByDepartment = (departmentId: string) => {
    return employees.filter((e) => e.departmentId === departmentId);
  };

  const getDepartmentById = (id: string) => {
    return departments.find((d) => d.id === id);
  };

  const getEmployeeById = (id: string) => {
    return employees.find((e) => e.id === id);
  };

  // Availability functions
  const addAvailability = (availability: Omit<AvailabilityEntry, 'id'>) => {
    const newAvailability = {
      ...availability,
      id: Date.now().toString(),
    };
    setAvailabilityEntries([...availabilityEntries, newAvailability]);
  };

  const updateAvailability = (id: string, availability: Partial<AvailabilityEntry>) => {
    setAvailabilityEntries(
      availabilityEntries.map((a) => (a.id === id ? { ...a, ...availability } : a))
    );
  };

  const removeAvailability = (id: string) => {
    setAvailabilityEntries(availabilityEntries.filter((a) => a.id !== id));
  };

  const getAvailabilityForEmployee = (employeeId: string) => {
    return availabilityEntries.filter((a) => a.employeeId === employeeId);
  };

  const getAvailabilityForDate = (date: Date) => {
    return availabilityEntries.filter((a) => isSameDay(a.date, date));
  };

  return (
    <HRContext.Provider
      value={{
        employees,
        departments,
        availabilityEntries,
        addEmployee,
        updateEmployee,
        removeEmployee,
        addDepartment,
        updateDepartment,
        removeDepartment,
        getEmployeesByDepartment,
        getDepartmentById,
        getEmployeeById,
        addAvailability,
        updateAvailability,
        removeAvailability,
        getAvailabilityForEmployee,
        getAvailabilityForDate,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = (): HRContextType => {
  const context = useContext(HRContext);
  if (context === undefined) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};

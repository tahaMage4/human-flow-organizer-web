
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeesPage from "./pages/employees/EmployeesPage";
import EmployeeDetails from "./pages/employees/EmployeeDetails";
import DepartmentsPage from "./pages/departments/DepartmentsPage";
import DepartmentDetails from "./pages/departments/DepartmentDetails";
import AvailabilityPage from "./pages/availability/AvailabilityPage";
import NotFound from "./pages/NotFound";
import { HRProvider } from "./context/HRContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HRProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:id" element={<EmployeeDetails />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/departments/:id" element={<DepartmentDetails />} />
              <Route path="/availability" element={<AvailabilityPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HRProvider>
  </QueryClientProvider>
);

export default App;


import React, { useState } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isBefore, isAfter, parseISO } from 'date-fns';
import { useHR } from '@/context/HRContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, PlusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AddAvailabilityForm from './AddAvailabilityForm';

const AvailabilityPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState<Date[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { availabilityEntries, employees, getEmployeeById } = useHR();
  const { toast } = useToast();

  // Calculate the start and end dates of the current week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

  // Get all the days in the current week
  const daysInWeek = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });

  const handlePreviousWeek = () => {
    setSelectedDate(subDays(selectedDate, 7));
  };

  const handleNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAvailabilityAdded = () => {
    setIsAddDialogOpen(false);
    toast({
      title: 'Availability added successfully',
      description: 'The availability has been added to the calendar.',
    });
  };

  // Get availabilities for the current week
  const weekAvailabilities = availabilityEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      isAfter(entryDate, subDays(weekStart, 1)) && 
      isBefore(entryDate, addDays(weekEnd, 1))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" /> Add Availability
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Availability</DialogTitle>
              </DialogHeader>
              <AddAvailabilityForm 
                onSuccess={handleAvailabilityAdded} 
                initialDate={selectedDate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-hr-primary" />
                Calendar
              </CardTitle>
              <CardDescription>
                Select a date to view availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border pointer-events-auto"
                initialFocus
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                  <span className="text-sm">Unavailable</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
              <CardDescription>
                Employee availability for the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {daysInWeek.map((day) => (
                    <div 
                      key={day.toISOString()} 
                      className={`text-center p-2 rounded-md ${
                        isSameDay(day, new Date()) ? 'bg-hr-highlight text-hr-primary font-medium' : ''
                      }`}
                    >
                      <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                      <div className="text-xs text-slate-500">{format(day, 'MMM d')}</div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {employees.map((employee) => {
                    const employeeAvailability = weekAvailabilities.filter(
                      entry => entry.employeeId === employee.id
                    );
                    
                    return (
                      <div key={employee.id} className="border-t pt-4">
                        <div className="font-medium mb-2">{employee.name}</div>
                        
                        <div className="grid grid-cols-7 gap-2">
                          {daysInWeek.map((day) => {
                            const dayAvailability = employeeAvailability.find(
                              avail => isSameDay(new Date(avail.date), day)
                            );
                            
                            return (
                              <div key={day.toISOString()} className="min-h-16 border rounded-md p-2">
                                {dayAvailability ? (
                                  <div className="text-xs">
                                    <Badge 
                                      variant={dayAvailability.status === 'available' ? 'default' : 'destructive'}
                                      className="mb-1"
                                    >
                                      {dayAvailability.status}
                                    </Badge>
                                    <div className="text-slate-700">
                                      {dayAvailability.startTime} - {dayAvailability.endTime}
                                    </div>
                                    {dayAvailability.note && (
                                      <div className="text-slate-500 mt-1 line-clamp-2">
                                        {dayAvailability.note}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-full text-xs text-slate-400">
                                    -
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;

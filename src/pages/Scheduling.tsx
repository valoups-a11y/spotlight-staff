import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, Users, Plus } from "lucide-react";

// Mock data for scheduling
const mockEmployees = [
  { id: 1, name: "Sarah Johnson", role: "Manager", maxHours: 8 },
  { id: 2, name: "Mike Chen", role: "Chef", maxHours: 7 },
  { id: 3, name: "Emma Davis", role: "Waiter", maxHours: 6 },
  { id: 4, name: "Alex Wilson", role: "Waiter", maxHours: 6 },
];

const mockShifts = [
  { id: 1, employeeId: 1, date: "2024-01-15", startTime: "09:00", endTime: "17:00", type: "morning" },
  { id: 2, employeeId: 2, date: "2024-01-15", startTime: "11:00", endTime: "19:00", type: "afternoon" },
  { id: 3, employeeId: 3, date: "2024-01-16", startTime: "17:00", endTime: "23:00", type: "evening" },
  { id: 4, employeeId: 4, date: "2024-01-15", startTime: "12:00", endTime: "20:00", type: "afternoon" },
  { id: 5, employeeId: 4, date: "2024-01-16", startTime: "17:00", endTime: "23:00", type: "evening" },
  { id: 6, employeeId: 2, date: "2024-01-16", startTime: "11:00", endTime: "19:00", type: "afternoon" },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = Array.from({ length: 15 }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`);

const Scheduling = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [hideLastName, setHideLastName] = useState(false);

  // Utility to convert time string to minutes since midnight
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Compute layout for overlapping shifts on a given day
  const computeDayLayout = (dayIndex: number) => {
    const targetDate = dayIndex === 0 ? "2024-01-15" : "2024-01-16";
    const dayShifts = mockShifts.filter(shift => shift.date === targetDate);
    
    // Convert shifts to intervals with minutes
    type IntervalType = {
      id: number;
      start: number;
      end: number;
      shift: any;
      column?: number;
    };
    
    const intervals: IntervalType[] = dayShifts.map(shift => ({
      id: shift.id,
      start: timeToMinutes(shift.startTime),
      end: timeToMinutes(shift.endTime),
      shift
    })).sort((a, b) => a.start - b.start);

    const layout = new Map();
    const activeShifts: IntervalType[] = [];
    
    for (const interval of intervals) {
      // Remove finished shifts from active set
      while (activeShifts.length > 0 && activeShifts[0].end <= interval.start) {
        activeShifts.shift();
      }
      
      // Find smallest available column
      const usedColumns = new Set(activeShifts.map(s => s.column).filter(c => c !== undefined));
      let column = 0;
      while (usedColumns.has(column)) {
        column++;
      }
      
      // Assign column to this shift
      interval.column = column;
      activeShifts.push(interval);
      activeShifts.sort((a, b) => a.end - b.end);
      
      // Calculate total columns for all overlapping shifts
      const maxColumn = Math.max(...activeShifts.map(s => s.column!));
      const totalColumns = maxColumn + 1;
      
      // Update layout for all active shifts
      activeShifts.forEach(activeShift => {
        layout.set(activeShift.id, {
          colIndex: activeShift.column!,
          totalColumns: totalColumns
        });
      });
    }
    
    return layout;
  };

  // Precompute layouts for all days
  const dayLayouts = daysOfWeek.map((_, dayIndex) => computeDayLayout(dayIndex));

  const getShiftTypeClass = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-shift-morning border-l-4 border-l-primary';
      case 'afternoon': return 'bg-shift-afternoon border-l-4 border-l-warning';
      case 'evening': return 'bg-shift-evening border-l-4 border-l-destructive';
      default: return 'bg-muted';
    }
  };

  const getShiftsStartingAtTime = (time: string, dayIndex: number) => {
    const targetDate = dayIndex === 0 ? "2024-01-15" : "2024-01-16";
    
    return mockShifts.filter(shift => {
      const currentHour = parseInt(time.split(':')[0]);
      const startHour = parseInt(shift.startTime.split(':')[0]);
      return shift.date === targetDate && currentHour === startHour;
    });
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    if (!employee) return '';
    return hideLastName ? employee.name.split(' ')[0] : employee.name;
  };

  const getShiftHeight = (shift: any) => {
    const startHour = parseInt(shift.startTime.split(':')[0]);
    const endHour = parseInt(shift.endTime.split(':')[0]);
    const duration = endHour - startHour;
    return duration * 60; // 60px per hour (min-h-[60px])
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Weekly Schedule</h2>
          <p className="text-muted-foreground">Drag and drop to assign shifts</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium min-w-[200px] text-center">
              Week of Jan 15 - Jan 21, 2024
            </span>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setHideLastName(!hideLastName)}
            >
              {hideLastName ? 'Show' : 'Hide'} Last Names
            </Button>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Shift
            </Button>
          </div>
        </div>
      </div>

      {/* Employee Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Available Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {mockEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center gap-3 p-3 border border-border rounded-xl bg-card hover:bg-accent transition-colors cursor-grab active:cursor-grabbing shadow-card"
                draggable
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-sm">{employee.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{employee.role}</Badge>
                    <span className="text-xs text-muted-foreground">{employee.maxHours}h max</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Schedule Grid
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header row */}
              <div className="grid border-b border-border" style={{ gridTemplateColumns: '60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr' }}>
                <div className="p-2 font-medium text-muted-foreground text-sm">Time</div>
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-4 font-medium text-center border-l border-border">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid border-b border-border hover:bg-muted/30" style={{ gridTemplateColumns: '60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr' }}>
                  <div className="p-2 text-xs text-muted-foreground font-medium">{time}</div>
                  {daysOfWeek.map((day, dayIndex) => {
                    const startingShifts = getShiftsStartingAtTime(time, dayIndex);
                    return (
                      <div 
                        key={`${day}-${time}`} 
                        className="p-2 border-l border-border min-h-[60px] hover:bg-accent/50 transition-colors relative"
                      >
                        {startingShifts.map((shift) => {
                          const layout = dayLayouts[dayIndex].get(shift.id);
                          if (!layout) return null;
                          
                          const { colIndex, totalColumns } = layout;
                          const widthPercent = 100 / totalColumns;
                          const leftPercent = colIndex * widthPercent;
                          
                          return (
                            <div 
                              key={shift.id}
                              className={`absolute top-2 p-2 rounded-lg text-xs ${getShiftTypeClass(shift.type)} shadow-shift z-10 animate-fade-in border border-border/20`}
                              style={{ 
                                height: `${getShiftHeight(shift) - 8}px`,
                                width: `${widthPercent - 1}%`,
                                left: `${leftPercent + 0.5}%`
                              }}
                            >
                              <div className="font-medium text-xs mb-1">{getEmployeeName(shift.employeeId)}</div>
                              <div className="text-[10px] opacity-75">{shift.startTime}</div>
                              <div className="text-[10px] opacity-75">{shift.endTime}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-muted-foreground">Shift Types:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-shift-morning rounded border-l-2 border-l-primary"></div>
              <span className="text-sm">Morning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-shift-afternoon rounded border-l-2 border-l-warning"></div>
              <span className="text-sm">Afternoon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-shift-evening rounded border-l-2 border-l-destructive"></div>
              <span className="text-sm">Evening</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scheduling;
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Clock, Users, Plus, Edit2, Trash2 } from "lucide-react";

// Types
type Employee = {
  id: number;
  name: string;
  role: string;
  maxHours: number;
};

type Shift = {
  id: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
};

// Mock data for scheduling
const mockEmployees: Employee[] = [
  { id: 1, name: "Sarah Johnson", role: "Manager", maxHours: 8 },
  { id: 2, name: "Mike Chen", role: "Chef", maxHours: 7 },
  { id: 3, name: "Emma Davis", role: "Waiter", maxHours: 6 },
  { id: 4, name: "Alex Wilson", role: "Waiter", maxHours: 6 },
];

const initialShifts: Shift[] = [
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
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [draggingEmployeeId, setDraggingEmployeeId] = useState<number | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Utility to convert time string to minutes since midnight
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper functions
  const getDateForDay = (dayIndex: number) => {
    const baseDate = new Date('2024-01-15');
    baseDate.setDate(baseDate.getDate() + dayIndex);
    return baseDate.toISOString().split('T')[0];
  };

  const determineShiftType = (startTime: string) => {
    const hour = parseInt(startTime.split(':')[0]);
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Compute layout for overlapping shifts on a given day
  const computeDayLayout = (dayIndex: number) => {
    const targetDate = getDateForDay(dayIndex);
    const dayShifts = shifts.filter(shift => shift.date === targetDate);
    
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
      case 'morning': return 'bg-shift-morning border-l-4 border-l-shift-morning-border';
      case 'afternoon': return 'bg-shift-afternoon border-l-4 border-l-warning';
      case 'evening': return 'bg-shift-evening border-l-4 border-l-destructive';
      default: return 'bg-muted';
    }
  };

  const getShiftsStartingAtTime = (time: string, dayIndex: number) => {
    const targetDate = getDateForDay(dayIndex);
    
    return shifts.filter(shift => {
      const currentHour = parseInt(time.split(':')[0]);
      const startHour = parseInt(shift.startTime.split(':')[0]);
      return shift.date === targetDate && currentHour === startHour;
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, employeeId: number) => {
    e.dataTransfer.setData('text/plain', employeeId.toString());
    setDraggingEmployeeId(employeeId);
  };

  const handleDragEnd = () => {
    setDraggingEmployeeId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number, timeSlot: string) => {
    e.preventDefault();
    const employeeId = parseInt(e.dataTransfer.getData('text/plain'));
    
    const targetDate = getDateForDay(dayIndex);
    const startHour = parseInt(timeSlot.split(':')[0]);
    const endHour = Math.min(startHour + 4, 23); // Default 4-hour shift, max end at 23:00
    
    const newShift: Shift = {
      id: Date.now(), // Simple ID generation
      employeeId,
      date: targetDate,
      startTime: `${String(startHour).padStart(2, '0')}:00`,
      endTime: `${String(endHour).padStart(2, '0')}:00`,
      type: determineShiftType(`${String(startHour).padStart(2, '0')}:00`)
    };

    setShifts(prev => [...prev, newShift]);
    setDraggingEmployeeId(null);
    
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    toast({
      title: "Shift Created",
      description: `Created shift for ${employee?.name} on ${targetDate}`
    });
  };

  // Edit shift handlers
  const handleShiftClick = (shift: Shift) => {
    setEditingShift(shift);
    setIsEditDialogOpen(true);
  };

  const handleShiftUpdate = () => {
    if (!editingShift) return;
    
    setShifts(prev => prev.map(shift => 
      shift.id === editingShift.id ? editingShift : shift
    ));
    setIsEditDialogOpen(false);
    setEditingShift(null);
    
    toast({
      title: "Shift Updated",
      description: "Shift has been successfully updated"
    });
  };

  const handleShiftDelete = () => {
    if (!editingShift) return;
    
    setShifts(prev => prev.filter(shift => shift.id !== editingShift.id));
    setIsEditDialogOpen(false);
    setEditingShift(null);
    
    toast({
      title: "Shift Deleted",
      description: "Shift has been successfully deleted"
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
                className={`flex items-center gap-3 p-3 border border-border rounded-xl bg-card hover:bg-accent transition-colors cursor-grab active:cursor-grabbing shadow-card ${
                  draggingEmployeeId === employee.id ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, employee.id)}
                onDragEnd={handleDragEnd}
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
                        className={`p-2 border-l border-border min-h-[60px] hover:bg-accent/50 transition-colors relative ${
                          draggingEmployeeId ? 'ring-1 ring-primary/20' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, dayIndex, time)}
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
                              className={`absolute top-2 p-2 rounded-lg text-xs ${getShiftTypeClass(shift.type)} shadow-shift z-10 animate-fade-in border border-border/20 cursor-pointer hover:ring-1 hover:ring-primary/40 transition-all`}
                              style={{ 
                                height: `${getShiftHeight(shift) - 8}px`,
                                width: `${widthPercent - 1}%`,
                                left: `${leftPercent + 0.5}%`
                              }}
                              onClick={() => handleShiftClick(shift)}
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
              <div className="w-4 h-4 bg-shift-morning rounded border-l-2 border-l-shift-morning-border"></div>
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

      {/* Edit Shift Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Shift
            </DialogTitle>
          </DialogHeader>
          {editingShift && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="employee">Employee</Label>
                <Select
                  value={editingShift.employeeId.toString()}
                  onValueChange={(value) => setEditingShift({
                    ...editingShift,
                    employeeId: parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.name} - {employee.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={editingShift.startTime}
                    onChange={(e) => setEditingShift({
                      ...editingShift,
                      startTime: e.target.value,
                      type: determineShiftType(e.target.value)
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={editingShift.endTime}
                    onChange={(e) => setEditingShift({
                      ...editingShift,
                      endTime: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="shiftType">Shift Type</Label>
                <Select
                  value={editingShift.type}
                  onValueChange={(value) => setEditingShift({
                    ...editingShift,
                    type: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingShift.startTime >= editingShift.endTime && (
                <p className="text-sm text-destructive">End time must be after start time</p>
              )}

              <div className="flex justify-between gap-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={handleShiftDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleShiftUpdate}
                    disabled={editingShift.startTime >= editingShift.endTime}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scheduling;
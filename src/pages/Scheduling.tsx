import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Clock, Users, Plus, Edit2, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WeekSwitcher } from "@/components/WeekSwitcher";
import { startOfWeek, addDays, format } from "date-fns";

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

// Constants for precise positioning
const ROW_HEIGHT_PX = 60; // 1px per minute
const GRID_START_MIN = 9 * 60; // 9:00 AM in minutes
const GRID_TOTAL_MIN = 15 * 60; // 15 hours
const GRID_END_MIN = GRID_START_MIN + GRID_TOTAL_MIN; // 24:00 (midnight)

const Scheduling = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date('2024-01-15')); // Set to show existing mock data
  const [asideCollapsed, setAsideCollapsed] = useState(false);
  const [hideLastName, setHideLastName] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [draggingEmployeeId, setDraggingEmployeeId] = useState<number | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Enhanced drag and drop state
  const [isDraggingShift, setIsDraggingShift] = useState(false);
  const [draggedShift, setDraggedShift] = useState<Shift | null>(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [guideLineY, setGuideLineY] = useState<number | null>(null);
  const [promptedEmployeeIdsThisWeek, setPromptedEmployeeIdsThisWeek] = useState<Set<number>>(new Set());
  
  // Duplication dialog state
  const [duplicateDialogState, setDuplicateDialogState] = useState<{
    open: boolean;
    employeeId: number;
    startTime: string;
    endTime: string;
    preselectedDays: number[];
    sourceDay: number;
  }>({
    open: false,
    employeeId: 0,
    startTime: '',
    endTime: '',
    preselectedDays: [],
    sourceDay: 0
  });
  
  const { toast } = useToast();

  // Utility functions for precise positioning
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const snapToFifteen = (minutes: number) => {
    return Math.round(minutes / 15) * 15;
  };

  const clampToGrid = (minutes: number) => {
    return Math.max(GRID_START_MIN, Math.min(GRID_END_MIN - 15, minutes));
  };

  // Helper functions
  const getDateForDay = (dayIndex: number) => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
    const targetDate = addDays(weekStart, dayIndex);
    return format(targetDate, 'yyyy-MM-dd');
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

  // Enhanced drag and drop handlers
  const handleDragStart = (e: React.DragEvent, employeeId: number) => {
    e.dataTransfer.setData('text/plain', employeeId.toString());
    setDraggingEmployeeId(employeeId);
  };

  const handleDragEnd = () => {
    setDraggingEmployeeId(null);
    setGuideLineY(null);
  };

  const handleDragOver = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    if (!draggingEmployeeId) return;
    
    // Show guide line at snapped position
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const snappedMinutes = snapToFifteen(GRID_START_MIN + offsetY);
    const guideY = snappedMinutes - GRID_START_MIN;
    setGuideLineY(guideY);
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    const employeeId = parseInt(e.dataTransfer.getData('text/plain'));
    
    // Calculate precise drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const startMinutes = clampToGrid(snapToFifteen(GRID_START_MIN + offsetY));
    const endMinutes = Math.min(startMinutes + 240, GRID_END_MIN); // 4 hour default
    
    const targetDate = getDateForDay(dayIndex);
    const newShift: Shift = {
      id: Date.now(),
      employeeId,
      date: targetDate,
      startTime: minutesToTime(startMinutes),
      endTime: minutesToTime(endMinutes),
      type: determineShiftType(minutesToTime(startMinutes))
    };

    setShifts(prev => [...prev, newShift]);
    setDraggingEmployeeId(null);
    setGuideLineY(null);
    
    // Check if this is the first shift for this employee this week
    const weekShifts = shifts.filter(shift => 
      shift.employeeId === employeeId && 
      getDateForDay(0) <= shift.date && 
      shift.date <= getDateForDay(6)
    );
    
    if (weekShifts.length === 0 && !promptedEmployeeIdsThisWeek.has(employeeId)) {
      // Show duplication dialog
      const preselectedDays = dayIndex < 5 ? 
        Array.from({length: 5}, (_, i) => i).filter(i => i !== dayIndex) : // Weekdays excluding current
        []; // Weekend - no preselection
      
      setDuplicateDialogState({
        open: true,
        employeeId,
        startTime: minutesToTime(startMinutes),
        endTime: minutesToTime(endMinutes),
        preselectedDays,
        sourceDay: dayIndex
      });
      
      setPromptedEmployeeIdsThisWeek(prev => new Set([...prev, employeeId]));
    }
    
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    toast({
      title: "Shift Created",
      description: `Created shift for ${employee?.name} on ${targetDate}`
    });
  };

  // Shift moving handlers
  const handleShiftPointerDown = (e: React.PointerEvent, shift: Shift) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDraggingShift(true);
    setDraggedShift(shift);
    setDragStartY(e.clientY);
    setDragStartTime(timeToMinutes(shift.startTime));
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleShiftPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingShift || !draggedShift) return;
    
    const deltaY = e.clientY - dragStartY;
    const newStartMinutes = clampToGrid(snapToFifteen(dragStartTime + deltaY));
    const duration = timeToMinutes(draggedShift.endTime) - timeToMinutes(draggedShift.startTime);
    const newEndMinutes = Math.min(newStartMinutes + duration, GRID_END_MIN);
    
    // Update shift immediately for live preview
    setShifts(prev => prev.map(s => 
      s.id === draggedShift.id ? {
        ...s,
        startTime: minutesToTime(newStartMinutes),
        endTime: minutesToTime(newEndMinutes),
        type: determineShiftType(minutesToTime(newStartMinutes))
      } : s
    ));
    
    setGuideLineY(newStartMinutes - GRID_START_MIN);
  };

  const handleShiftPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingShift) return;
    
    const deltaY = Math.abs(e.clientY - dragStartY);
    if (deltaY < 4 && draggedShift) {
      // Treat as click - open edit dialog
      handleShiftClick(draggedShift);
    }
    
    setIsDraggingShift(false);
    setDraggedShift(null);
    setGuideLineY(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
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
          <WeekSwitcher 
            currentWeek={currentWeek} 
            onWeekChange={setCurrentWeek} 
          />
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

      {/* Main Content: Two-column layout */}
      <div className="flex gap-4 h-[calc(100vh-232px)]"> {/* Fixed height container */}
        {/* Left Column: Sticky Employee Panel */}
        <aside className={`flex-shrink-0 ${asideCollapsed ? 'w-16' : 'w-56 lg:w-64'} transition-all duration-300`}>
          <div className="sticky top-20 h-[calc(100vh-312px)] overflow-y-auto">
            <Card className="border-r">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 ${asideCollapsed ? 'hidden' : ''}`}>
                    <Users className="w-5 h-5" />
                    <div className="flex flex-col leading-tight">
                      <span>Available</span>
                      <span>Employees</span>
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setAsideCollapsed(!asideCollapsed)}
                  >
                    {asideCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <TooltipProvider>
                  <div className="space-y-2">
                    {mockEmployees.map((employee) => (
                      <div key={employee.id}>
                        {asideCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-grab active:cursor-grabbing transition-opacity hover:bg-gradient-primary/90 ${
                                  draggingEmployeeId === employee.id ? 'opacity-50' : ''
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, employee.id)}
                                onDragEnd={handleDragEnd}
                              >
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <div className="text-xs">
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-muted-foreground">{employee.role} • {employee.maxHours}h max</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div
                            className={`flex items-center gap-2.5 p-2.5 border border-border rounded-xl bg-card hover:bg-accent transition-colors cursor-grab active:cursor-grabbing shadow-card ${
                              draggingEmployeeId === employee.id ? 'opacity-50' : ''
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, employee.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs truncate" title={employee.name}>{employee.name}</p>
                              <div className="flex flex-col gap-0.5 mt-0.5">
                                <Badge variant="secondary" className="text-xs h-4 px-1.5 w-fit">{employee.role}</Badge>
                                <span className="text-xs text-muted-foreground">{employee.maxHours}h max</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Right Column: Scrollable Schedule Grid */}
        <main className="flex-1 space-y-4">
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
                  {/* Time + Days Header (outside scrollable grid) */}
                  <div className="h-12 grid items-center bg-card border-b border-border shadow-sm" style={{ gridTemplateColumns: '60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr' }}>
                    <div className="px-2 font-medium text-muted-foreground text-sm flex items-center h-full">Time</div>
                    {daysOfWeek.map((day, dayIndex) => (
                      <div key={day} className="p-4 font-medium text-center border-l border-border">
                        {day}
                        <div className="text-xs text-muted-foreground mt-1">
                          {getDateForDay(dayIndex).split('-').slice(1).join('/')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vertically scrollable grid body */}
                  <div className="max-h-[calc(100vh-312px)] overflow-y-auto">
                    {/* Grid container with time labels and day columns */}
                    <div className="grid" style={{ gridTemplateColumns: '60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr', height: `${GRID_TOTAL_MIN}px` }}>
                       {/* Time labels column */}
                       <div className="relative border-r border-border">
                         {timeSlots.map((time, index) => (
                           <div 
                             key={time}
                             className="absolute left-0 w-full p-2 text-xs text-muted-foreground font-medium border-b border-border/50"
                             style={{ top: `${index * 60}px`, height: '60px' }}
                           >
                             {time}
                           </div>
                         ))}
                       </div>

                       {/* Day columns */}
                       {daysOfWeek.map((day, dayIndex) => {
                         const dayShifts = shifts.filter(shift => shift.date === getDateForDay(dayIndex));
                         const dayLayout = dayLayouts[dayIndex];
                         
                         return (
                           <div 
                             key={day}
                             className={`relative border-l border-border transition-colors ${
                               draggingEmployeeId ? 'ring-1 ring-primary/20 bg-primary/5' : 'hover:bg-muted/20'
                             }`}
                             onDragOver={(e) => handleDragOver(e, dayIndex)}
                             onDrop={(e) => handleDrop(e, dayIndex)}
                           >
                             {/* Hour grid lines */}
                             {timeSlots.map((_, index) => (
                               <div 
                                 key={index}
                                 className="absolute left-0 w-full border-b border-border/30"
                                 style={{ top: `${index * 60}px`, height: '60px' }}
                               />
                             ))}

                             {/* Guide line during drag */}
                             {guideLineY !== null && draggingEmployeeId && (
                               <div 
                                 className="absolute left-0 w-full h-0.5 bg-primary/60 z-20 pointer-events-none"
                                 style={{ top: `${guideLineY}px` }}
                               />
                             )}

                             {/* Shifts */}
                             {dayShifts.map((shift) => {
                               const layout = dayLayout.get(shift.id);
                               if (!layout) return null;
                               
                               const { colIndex, totalColumns } = layout;
                               const startY = timeToMinutes(shift.startTime) - GRID_START_MIN;
                               const height = timeToMinutes(shift.endTime) - timeToMinutes(shift.startTime);
                               const widthPercent = 100 / totalColumns;
                               const leftPercent = colIndex * widthPercent;
                               
                               return (
                                 <div 
                                   key={shift.id}
                                   className={`absolute p-2 rounded-lg text-xs ${getShiftTypeClass(shift.type)} shadow-shift z-10 animate-fade-in border border-border/20 cursor-move hover:ring-1 hover:ring-primary/40 transition-all select-none ${
                                     isDraggingShift && draggedShift?.id === shift.id ? 'opacity-70' : ''
                                   }`}
                                   style={{ 
                                     top: `${startY}px`,
                                     height: `${height}px`,
                                     width: `${widthPercent - 2}%`,
                                     left: `${leftPercent + 1}%`
                                   }}
                                   onPointerDown={(e) => handleShiftPointerDown(e, shift)}
                                   onPointerMove={handleShiftPointerMove}
                                   onPointerUp={handleShiftPointerUp}
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
                   </div>
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

      {/* Duplicate Shift Dialog */}
      <Dialog open={duplicateDialogState.open} onOpenChange={(open) => setDuplicateDialogState({...duplicateDialogState, open})}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Duplicate Shift to Other Days
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Created shift for {mockEmployees.find(emp => emp.id === duplicateDialogState.employeeId)?.name} 
                from {duplicateDialogState.startTime} to {duplicateDialogState.endTime}.
              </p>
              <p className="text-sm font-medium">Would you like to duplicate this shift to other days?</p>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select days to duplicate to:</Label>
              <div className="grid grid-cols-2 gap-3">
                {daysOfWeek.map((day, dayIndex) => {
                  const isSourceDay = dayIndex === duplicateDialogState.sourceDay;
                  const isPreselected = duplicateDialogState.preselectedDays.includes(dayIndex);
                  
                  return (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${dayIndex}`}
                        checked={isSourceDay ? true : isPreselected}
                        disabled={isSourceDay}
                        onCheckedChange={(checked) => {
                          if (isSourceDay) return;
                          const newDays = checked 
                            ? [...duplicateDialogState.preselectedDays, dayIndex]
                            : duplicateDialogState.preselectedDays.filter(d => d !== dayIndex);
                          setDuplicateDialogState({
                            ...duplicateDialogState,
                            preselectedDays: newDays
                          });
                        }}
                      />
                      <Label 
                        htmlFor={`day-${dayIndex}`}
                        className={`text-sm ${isSourceDay ? 'text-muted-foreground' : ''}`}
                      >
                        {day} {isSourceDay && '(current)'}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setDuplicateDialogState({...duplicateDialogState, open: false})}
              >
                Skip
              </Button>
              <Button 
                onClick={() => {
                  // Create duplicate shifts
                  const newShifts = duplicateDialogState.preselectedDays.map(dayIndex => ({
                    id: Date.now() + dayIndex, // Ensure unique IDs
                    employeeId: duplicateDialogState.employeeId,
                    date: getDateForDay(dayIndex),
                    startTime: duplicateDialogState.startTime,
                    endTime: duplicateDialogState.endTime,
                    type: determineShiftType(duplicateDialogState.startTime)
                  }));
                  
                  setShifts(prev => [...prev, ...newShifts]);
                  setDuplicateDialogState({...duplicateDialogState, open: false});
                  
                  toast({
                    title: "Shifts Duplicated",
                    description: `Created ${newShifts.length} additional shifts`
                  });
                }}
                disabled={duplicateDialogState.preselectedDays.length === 0}
              >
                Duplicate ({duplicateDialogState.preselectedDays.length} days)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Scheduling;
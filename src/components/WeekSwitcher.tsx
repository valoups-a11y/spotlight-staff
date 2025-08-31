import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";

interface WeekSwitcherProps {
  currentWeek: Date;
  onWeekChange: (week: Date) => void;
}

export const WeekSwitcher = ({ currentWeek, onWeekChange }: WeekSwitcherProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  
  const weekLabel = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
  
  const handlePreviousWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1));
  };
  
  const handleNextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1));
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onWeekChange(date);
      setIsCalendarOpen(false);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {weekLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={currentWeek}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Button variant="outline" size="sm" onClick={handleNextWeek}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
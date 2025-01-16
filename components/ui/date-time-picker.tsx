"use client";

import * as React from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleSelect = (selected: Date | undefined) => {
    if (selected) {
      const newDate = new Date(selected);
      if (selectedDate) {
        newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      } else {
        const now = new Date();
        newDate.setHours(now.getHours(), now.getMinutes());
      }
      setSelectedDate(newDate);
      setDate(newDate);
    }
  };

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
    if (!selectedDate) {
      const now = new Date();
      setSelectedDate(now);
      setDate(now);
      return;
    }

    const newDate = new Date(selectedDate);
    const numValue = parseInt(value, 10);

    if (type === "hours" && !isNaN(numValue)) {
      if (numValue >= 0 && numValue < 24) {
        newDate.setHours(numValue);
        setSelectedDate(newDate);
        setDate(newDate);
      }
    } else if (type === "minutes" && !isNaN(numValue)) {
      if (numValue >= 0 && numValue < 60) {
        newDate.setMinutes(numValue);
        setSelectedDate(newDate);
        setDate(newDate);
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "dd.MM.yyyy", { locale: de })
            ) : (
              <span>Datum auswählen</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            locale={de}
          />
        </PopoverContent>
      </Popover>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          min={0}
          max={23}
          className="w-[70px]"
          placeholder="HH"
          value={selectedDate ? selectedDate.getHours() : ""}
          onChange={(e) => handleTimeChange("hours", e.target.value)}
        />
        <span>:</span>
        <Input
          type="number"
          min={0}
          max={59}
          className="w-[70px]"
          placeholder="MM"
          value={selectedDate ? selectedDate.getMinutes() : ""}
          onChange={(e) => handleTimeChange("minutes", e.target.value)}
        />
      </div>
    </div>
  );
}

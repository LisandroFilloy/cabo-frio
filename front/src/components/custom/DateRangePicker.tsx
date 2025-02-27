import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export default function DateRangePicker({ onDateRangeChange, className }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>();

  React.useEffect(() => {
    onDateRangeChange(date);  // Notify parent of the date range change
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor="date" className="font-normal text-start text-sm h-[15px]">
        Fecha
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "font-normal w-[250px]",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: es })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: es })
              )
            ) : (
              <span>Elegi una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            locale={es}
            initialFocus
            mode="range"
            selected={date}
            onSelect={setDate}  // Set selected date range
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

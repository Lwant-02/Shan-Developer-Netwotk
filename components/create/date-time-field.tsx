"use client";

import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateEn } from "@/lib/datetime";
import { cn } from "@/lib/utils";

// The event-start picker (PBI-022): a shadcn Calendar + a native time input behind a
// popover, replacing the raw `<input type="datetime-local">`. The value stays in the
// datetime-local shape ("YYYY-MM-DDTHH:mm") so `toUtcISO` still normalises it to UTC on
// publish. `"use client"` is the popover state and the change handlers.
//
// The trigger and the time input are both `h-9`, matching the sign-in CTA and the other
// composer inputs so every control in the form lines up.

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Local "YYYY-MM-DD" for a Date — never `toISOString()`, which would shift across the
// UTC+06:30 offset and land the author on the wrong day.
function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parse(value: string): { date?: Date; time: string } {
  const [datePart, timePart] = value.split("T");
  const date = datePart ? new Date(`${datePart}T00:00`) : undefined;
  return {
    date: date && !Number.isNaN(date.getTime()) ? date : undefined,
    time: timePart ?? "",
  };
}

export function DateTimeField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("Create");
  const { date, time } = parse(value);

  function setDate(next: Date | undefined) {
    if (!next) {
      onChange(time ? `T${time}` : "");
      return;
    }
    onChange(`${toDateKey(next)}T${time || "12:00"}`);
  }

  function setTime(nextTime: string) {
    const dateKey = date ? toDateKey(date) : "";
    onChange(nextTime ? `${dateKey}T${nextTime}` : dateKey);
  }

  return (
    <Popover>
      <PopoverTrigger
        id={id}
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "w-full cursor-pointer justify-start gap-2 font-normal",
          !value && "text-muted-foreground",
        )}
      >
        <CalendarDays className="size-4 shrink-0" />
        {value
          ? formatDateEn(value, { dateStyle: "medium", timeStyle: "short" })
          : t("phStart")}
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto flex-col gap-3 p-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          autoFocus
        />
        <Input
          type="time"
          aria-label={t("fieldStartTime")}
          value={time}
          onChange={(event) => setTime(event.target.value)}
          className="h-9"
        />
      </PopoverContent>
    </Popover>
  );
}

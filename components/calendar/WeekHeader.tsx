"use client";

import { eachDayOfInterval, format, isToday } from "date-fns";
import { useCalendarStore } from "@/store/useCalendarStore";

export default function WeekHeader() {
  const { weekStart, weekEnd } = useCalendarStore();
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="grid grid-cols-8 border-b bg-gray-50 w-full">
      <div className="h-12 flex items-center justify-center text-sm border-r font-medium text-gray-500">
        GMT+07
      </div>
      {days.map((day) => (
        <div
          key={day.toString()}
          className={`h-12 flex flex-col items-center justify-center border-r ${
            isToday(day) ? "bg-blue-100 font-bold text-blue-600" : "bg-white"
          }`}
        >
          <div className="text-xs">{format(day, "EEE")}</div>
          <div className="text-sm">{format(day, "d")}</div>
        </div>
      ))}
    </div>
  );
}

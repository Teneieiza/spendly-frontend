import { create } from "zustand";
import {
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  format,
} from "date-fns";

interface CalendarState {
  currentDate: Date;
  weekStart: Date;
  weekEnd: Date;
  nextWeek: () => void;
  prevWeek: () => void;
  goToday: () => void;
  getMonthLabel: () => string;
}

const getInitialDate = () => {
  if (typeof window === "undefined") {
    const fixed = new Date("2025-01-01T00:00:00Z");
    return {
      currentDate: fixed,
      weekStart: startOfWeek(fixed, { weekStartsOn: 0 }),
      weekEnd: endOfWeek(fixed, { weekStartsOn: 0 }),
    };
  }
  const today = new Date();
  return {
    currentDate: today,
    weekStart: startOfWeek(today, { weekStartsOn: 0 }),
    weekEnd: endOfWeek(today, { weekStartsOn: 0 }),
  };
};

export const useCalendarStore = create<CalendarState>((set, get) => ({
  ...getInitialDate(),

  nextWeek: () => {
    const { weekEnd } = get();
    const next = addWeeks(weekEnd, 1);
    set({
      weekStart: startOfWeek(next, { weekStartsOn: 0 }),
      weekEnd: endOfWeek(next, { weekStartsOn: 0 }),
      currentDate: next,
    });
  },
  prevWeek: () => {
    const { weekStart } = get();
    const prev = subWeeks(weekStart, 1);
    set({
      weekStart: startOfWeek(prev, { weekStartsOn: 0 }),
      weekEnd: endOfWeek(prev, { weekStartsOn: 0 }),
      currentDate: prev,
    });
  },
  goToday: () => {
    const today = new Date();
    set({
      currentDate: today,
      weekStart: startOfWeek(today, { weekStartsOn: 0 }),
      weekEnd: endOfWeek(today, { weekStartsOn: 0 }),
    });
  },
  getMonthLabel: () => {
    const { weekStart, weekEnd } = get();
    const sameMonth = isSameMonth(weekStart, weekEnd);
    if (sameMonth) return format(weekStart, "MMM yyyy");
    return `${format(weekStart, "MMM")} - ${format(weekEnd, "MMM yyyy")}`;
  },
}));

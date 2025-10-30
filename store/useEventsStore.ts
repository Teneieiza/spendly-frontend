import { create } from "zustand";
import { nanoid } from "nanoid";

export type EntryType = "income" | "expense";

export type EventItem = {
  id: string;
  date: string; // yyyy-MM-dd
  hour: number; // 1-24 (ตรงกับ hours array)
  title: string;
  type: EntryType;
  category: string;
  amount: number;
  color: string; // hex or tailwind color
};

type EventsState = {
  events: Record<string, EventItem[]>; // key = date string
  addEvent: (e: Omit<EventItem, "id">) => EventItem;
  getEventsByDate: (date: string) => EventItem[];
};

export const useEventsStore = create<EventsState>((set, get) => ({
  events: {},
  addEvent: (e) => {
    const id = nanoid();
    const item: EventItem = { id, ...e };
    const dateKey = e.date;
    const existing = get().events[dateKey] ?? [];
    set({ events: { ...get().events, [dateKey]: [...existing, item] } });
    return item;
  },
  getEventsByDate: (date) => {
    return get().events[date] ?? [];
  },
}));

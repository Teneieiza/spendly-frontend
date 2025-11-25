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
  updateEvent: (id: string, e: Omit<EventItem, "id">) => void;
  deleteEvent: (id: string) => void;
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

  updateEvent: (id, updated) => {
    const all = get().events;
    let newEvents = { ...all };
    let found = false;

    // ค้นหา event เดิมก่อน
    for (const dateKey of Object.keys(all)) {
      const arr = all[dateKey];
      const index = arr.findIndex((ev) => ev.id === id);
      if (index !== -1) {
        found = true;
        // ถ้าวันที่เปลี่ยน — ต้องย้าย event ไปวันใหม่
        if (dateKey !== updated.date) {
          // ลบจากวันเก่า
          newEvents[dateKey] = arr.filter((ev) => ev.id !== id);
          // เพิ่มไปวันใหม่
          const newArr = newEvents[updated.date] ?? [];
          newEvents[updated.date] = [...newArr, { id, ...updated }];
        } else {
          // ถ้าวันที่ยังเหมือนเดิม — อัปเดตใน array เดิม
          const newArr = [...arr];
          newArr[index] = { id, ...updated };
          newEvents[dateKey] = newArr;
        }
        break;
      }
    }

    if (found) set({ events: newEvents });
  },

  deleteEvent: (id) => {
    const all = get().events;
    const newEvents: Record<string, EventItem[]> = {};
    for (const [dateKey, arr] of Object.entries(all)) {
      newEvents[dateKey] = arr.filter((ev) => ev.id !== id);
    }
    set({ events: newEvents });
  },

  getEventsByDate: (date) => {
    return get().events[date] ?? [];
  },
}));

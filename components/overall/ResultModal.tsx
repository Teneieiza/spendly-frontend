'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useEventsStore } from '@/store/useEventsStore'

interface MainModalProps {
  open: boolean
  setOpen: (val: boolean) => void
  selectedDate: Date | null
  selectedDayKey: string | null
  dayNotes: Record<string, string>
  selectedDayNote: string
  setDayNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>

  form: { category: string; note: string; amount: string }
  setForm: React.Dispatch<
    React.SetStateAction<{ category: string; note: string; amount: string }>
  >

  editId: string | null
  setEditId: (val: string | null) => void
  setAddOpen: (val: boolean) => void
}

export default function ResultModal({
  open,
  setOpen,
  selectedDate,
  selectedDayKey,
  dayNotes,
  selectedDayNote,
  setDayNotes,
}: MainModalProps) {
  const allEvents = useEventsStore((s) => s.events)

  const events = selectedDayKey ? (allEvents[selectedDayKey] ?? []) : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            RECORDS OF {selectedDate && format(selectedDate, 'dd MMM yyyy')}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between rounded-md border p-3 text-lg"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: ev.color }}
                  />
                  <span>{ev.title}</span>
                  <span className="text-gray-600">({ev.category})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold">{ev.amount} ฿</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Day Note */}
        <div className="mt-4">
          <Input
            placeholder="Note for this day"
            value={selectedDayNote}
            onChange={(e) =>
              setDayNotes({ ...dayNotes, [selectedDayKey!]: e.target.value })
            }
            className="py-6 text-lg"
          />
        </div>

        <DialogFooter className="mt-6 flex w-full justify-between">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 px-6 py-4 font-bold"
          >
            CLOSE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

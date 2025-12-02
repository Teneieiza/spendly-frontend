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

  const incomeTotal = events
    .filter((ev) => ev.type === 'income')
    .reduce((sum, ev) => sum + ev.amount, 0)

  const expenseTotal = events
    .filter((ev) => ev.type === 'expense')
    .reduce((sum, ev) => sum + ev.amount, 0)

  const net = incomeTotal - expenseTotal

  let summaryLabel = ''
  let summaryColor = ''

  if (net > 0) {
    summaryLabel = 'Increased income'
    summaryColor = 'text-green-600'
  } else if (net == 0) {
    summaryLabel = ''
    summaryColor = 'text-black'
  } else {
    summaryLabel = 'Already spent'
    summaryColor = 'text-red-600'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="cursor-default text-2xl font-bold">
            RECORDS OF{' '}
            {selectedDate && format(selectedDate, 'dd MMM yyyy').toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div
            className={`max-h-96 cursor-default space-y-2 overflow-y-auto rounded-sm p-2 ${
              events.length > 0 ? 'border-2' : ''
            }`}
          >
            {[...events]
              .sort((a, b) => a.hour - b.hour)
              .map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between rounded-md border p-3 text-lg"
                >
                  <div className="flex w-78 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: ev.color }}
                      />
                      <span className="max-w-[100px] truncate overflow-hidden whitespace-nowrap">
                        {ev.title}
                      </span>

                      <span className="max-w-[100px] truncate overflow-hidden whitespace-nowrap text-gray-600">
                        ({ev.category})
                      </span>
                    </div>

                    <div>
                      <span className="ml-5 text-sm text-gray-500">
                        {String(ev.hour).padStart(2, '0')}:00 -
                        {String((ev.hour + 1) % 24).padStart(2, '0')}:00
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {ev.type === 'income' ? '+' : '-'}
                      {ev.amount} ฿
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {/* Total Amount */}
          <div className="mt-10 flex cursor-default justify-between rounded-md border bg-gray-100 p-3 text-lg font-bold">
            <span>Total:</span>
            <div className="flex gap-4">
              <span>{summaryLabel}</span>
              <div className="flex gap-2">
                <span className={summaryColor}>{net}</span>
                <span>฿</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Day Note */}
        <div>
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
            className="flex-1 cursor-pointer px-6 py-4 font-bold"
          >
            CLOSE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

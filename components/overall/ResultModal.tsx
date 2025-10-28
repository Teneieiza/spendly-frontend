'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

type RecordType = {
  date: string
  amount: number
  note: string
  category: string
}

type CategoryType = {
  name: string
  color: string
}

interface MainModalProps {
  open: boolean
  setOpen: (val: boolean) => void
  selectedDate: Date | null
  selectedDayKey: string | null
  records: RecordType[]
  setRecords: (records: RecordType[]) => void
  categories: CategoryType[]
  dayNotes: Record<string, string> 
  selectedDayNote: string
  setDayNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>
  form: { category: string; note: string; amount: string }
  setForm: React.Dispatch<React.SetStateAction<{ category: string; note: string; amount: string }>>
  setEditIndex: (val: number | null) => void
  editIndex: number | null
  setAddOpen: (val: boolean) => void
}

export default function ResultModal({
  open,
  setOpen,
  selectedDate,
  selectedDayKey,
  records,
  setRecords,
  categories,
  dayNotes,
  selectedDayNote,
  setDayNotes,
  form,
  setForm,
  setEditIndex,
  editIndex,
  setAddOpen,
}: MainModalProps) {
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
            {records
              .filter((r) => r.date === selectedDayKey)
              .map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border p-3 text-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        categories.find((c) => c.name === r.category)?.color
                      }`}
                    />
                    <span>{r.note}</span>
                    <span className="text-gray-600">({r.category})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{r.amount}฿</span>
                    <Edit
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      size={20}
                      onClick={() => {
                        setForm({
                          category: r.category,
                          note: r.note,
                          amount: r.amount.toString(),
                        })
                        setEditIndex(i)
                        setAddOpen(true)
                      }}
                    />
                    <Trash2
                      className="cursor-pointer text-red-600 hover:text-red-800"
                      size={20}
                      onClick={() => {
                        setRecords(records.filter((_, idx) => idx !== i))
                      }}
                    />
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

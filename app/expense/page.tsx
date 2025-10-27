'use client'

import { JSX, useState } from 'react'
import {
  format,
  startOfMonth,
  addDays,
  getDaysInMonth,
  isToday,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Utensils,
  Car,
  ShoppingBag,
  Calendar,
  Edit,
  Trash2,
  CircleAlert,
} from 'lucide-react'

type Category = {
  name: string
  color: string
  icon: JSX.Element
}

const categories: Category[] = [
  { name: 'Food', color: 'bg-green-400', icon: <Utensils size={14} /> },
  { name: 'Travel', color: 'bg-blue-400', icon: <Car size={14} /> },
  { name: 'Shopping', color: 'bg-pink-400', icon: <ShoppingBag size={14} /> },
]

export default function ExpenseDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [records, setRecords] = useState<
    { date: string; amount: number; note: string; category: string }[]
  >([])

  const [dayNotes, setDayNotes] = useState<Record<string, string>>({})

  const totalDays = getDaysInMonth(new Date(year, month))
  const startDate = startOfMonth(new Date(year, month))
  const days = Array.from({ length: totalDays }, (_, i) =>
    addDays(startDate, i),
  )

  const [form, setForm] = useState({
    category: '',
    note: '',
    amount: '',
  })

  const selectedDayKey = selectedDate
    ? format(selectedDate, 'yyyy-MM-dd')
    : null
  const selectedDayNote = selectedDayKey ? (dayNotes[selectedDayKey] ?? '') : ''

  const [monthlyBudget, setMonthlyBudget] = useState(20000)

  const monthlyTotal = records
    .filter(
      (r) =>
        format(new Date(r.date), 'yyyy-MM') ===
        format(new Date(year, month), 'yyyy-MM'),
    )
    .reduce((sum, r) => sum + r.amount, 0)

  const remaining = monthlyBudget - monthlyTotal
  const percentLeft = Math.max(0, (remaining / monthlyBudget) * 100)

  let statusMessage = ''
  let barColor = ''
  let textColor = ''

  if (remaining <= 0) {
    statusMessage = 'BROKE! 💀'
    barColor = 'bg-red-600'
    textColor = 'text-red-700'
  } else if (percentLeft < 30) {
    statusMessage = 'Will you survive this month? 🥲'
    barColor = 'bg-orange-500'
    textColor = 'text-orange-600'
  } else if (percentLeft < 50) {
    statusMessage = 'Slow down your spending 👀'
    barColor = 'bg-yellow-400'
    textColor = 'text-yellow-600'
  } else {
    statusMessage = 'You are spending wisely 👍'
    barColor = 'bg-green-500'
    textColor = 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={month.toString()}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="text-md w-44 font-bold">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="text-lg">
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(new Date(2025, i), 'MMMM')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={year.toString()}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="text-md w-40 font-bold">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const y = 2023 + i
                return (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="text-md px-14 py-2 font-bold">
          FILTER
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-2 flex items-center justify-center gap-4">
          <Calendar size={48} className="text-gray-700" />
          <div className="flex items-center text-4xl font-bold tracking-wide text-black md:text-6xl">
            <span className="mr-3 text-2xl font-medium md:text-4xl">
              {format(new Date(year, month), 'MMMM')
                .toUpperCase()
                .split('')
                .join(' ')}
            </span>
            <span className="text-2xl font-bold md:text-4xl">
              {format(new Date(year, month), 'yyyy')}
            </span>
          </div>
        </div>

        {/* Days */}
        {days.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd')
          const dayRecords = records.filter((r) => r.date === dayKey)
          const uniqueCats = Array.from(
            new Set(dayRecords.map((r) => r.category)),
          )

          return (
            <div
              key={dayKey}
              onClick={() => {
                setSelectedDate(day)
                setOpen(true)
              }}
              className={`group relative flex h-32 rounded-sm cursor-pointer flex-col items-center justify-center p-3 shadow-sm transition-colors duration-300 hover:shadow-lg ${
                isToday(day)
                  ? 'bg-gradient-to-br from-[#4ae6b7] via-[#6fd6b7] to-[#b8f0f1] hover:from-[#a4e4ce] hover:via-[#2ddd97] hover:to-[#15db96]'
                  : 'bg-[#AE7BDA] hover:bg-[#CBA3EE]'
              }`}
            >
              {uniqueCats.length > 0 && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {uniqueCats.map((cat) => {
                    const catObj = categories.find((c) => c.name === cat)
                    return (
                      <div
                        key={cat}
                        className={`h-4 w-4 border border-black ${catObj?.color}`}
                      />
                    )
                  })}
                </div>
              )}

              <div
                className={`flex items-baseline gap-1 font-bold transition-colors ${
                  isToday(day)
                    ? 'text-black'
                    : 'text-white group-hover:text-black'
                }`}
              >
                <span className="text-xl md:text-3xl">{format(day, 'd')}</span>
                <span className="text-sm tracking-wider md:text-base">
                  {format(day, 'EEE').toUpperCase()}
                </span>
              </div>

              <div
                className={`my-1 w-[50%] border-t transition-colors ${
                  isToday(day)
                    ? 'border-1 border-black'
                    : 'border-white group-hover:border-1 group-hover:border-black'
                }`}
              />

              <div className="line-clamp-2 text-sm text-black">
                {dayNotes[dayKey] ?? ''}
              </div>
            </div>
          )
        })}

        {/* Monthly Budget Status Bar */}
        <div className="fixed right-11 bottom-16 flex h-32 w-110 flex-col justify-center gap-2 rounded-lg border-2 border-black bg-white px-6 shadow-lg">
          {/* Tips Icon */}
          <div className="absolute top-1 right-1">
            <div className="group relative cursor-pointer">
              <span className="text-lg font-bold text-red-600">
                <CircleAlert size={20}/>
              </span>
              <div className="pointer-events-none absolute -top-20 -right-2 w-80 rounded-md bg-gray-900 px-6 py-6 text-sm font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Spend wisely to keep your HP healthy!
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center text-md font-bold text-black">
            <p className="flex items-start justify-start">NAME:</p>
            <p className="ml-40">MONEY: {remaining} ฿</p>
          </div>

          {/*Hp Bar*/}
          <div className="flex w-full items-center justify-start gap-2">
            <p className="text-lg font-bold">HP: </p>
            <div className="relative h-5 w-full overflow-hidden rounded-full border border-black bg-gray-200">
              {/* Animated Gradient Bar */}
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  width: `${percentLeft}%`,
                  transition: 'width 0.5s ease-in-out',
                  backgroundImage:
                    percentLeft <= 0
                      ? 'linear-gradient(270deg, #dc2626, #b91c1c, #dc2626)'
                      : percentLeft < 30
                        ? 'linear-gradient(270deg, #dc2626, #b91c1c, #dc2626)'
                        : percentLeft < 50
                          ? 'linear-gradient(270deg, #f97316, #ea580c, #f97316)'
                          : percentLeft < 70
                            ? 'linear-gradient(270deg, #facc15, #eab308, #facc15)'
                            : 'linear-gradient(270deg, #22c55e, #16a34a, #22c55e)',
                  backgroundSize: '600% 100%',
                  backgroundPosition: '0% 50%',
                  animation: 'gradientShift 3s linear infinite',
                }}
              >
                {/* Particles */}
                {Array.from({ length: 15 }).map((_, i) => {
                  let particleColor = ''
                  if (percentLeft < 30) particleColor = 'rgba(220,38,38,0.6)'
                  else if (percentLeft < 50)
                    particleColor = 'rgba(250,204,21,0.6)'
                  else particleColor = 'rgba(34,197,94,0.6)'

                  return (
                    <div
                      key={i}
                      className="absolute top-0 h-full w-1 rounded-full opacity-70 blur-sm"
                      style={{
                        left: `${i * 6 + Math.random() * 5}%`,
                        backgroundColor: particleColor,
                        animation: `particleMove ${1 + Math.random() * 2}s ease-in-out infinite alternate`,
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <p
            className={`text-md flex items-center justify-center font-bold ${textColor}`}
          >
            {statusMessage}
          </p>
        </div>

        {/* ใส่ style global **นอก div ทั้งหมด** */}
        <style jsx>{`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes particleMove {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-50%);
            }
            100% {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>

      {/* Main Modal */}
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
              onClick={() => {
                setForm({ category: '', note: '', amount: '' })
                setEditIndex(null)
                setAddOpen(true)
              }}
              className="mr-12 flex-1 px-6 py-4 font-bold"
            >
              ADD RECORD
            </Button>
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

      {/* Add or Edit Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg px-6 py-6 [&>button]:hidden">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">
              {editIndex !== null ? 'EDIT RECORD' : 'ADD RECORD'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-lg">
            <Select
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v })}
            >
              <SelectTrigger className="w-44 py-6">
                <SelectValue placeholder="CHOOSE CATEGORY" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    <div className="flex items-center justify-between">
                      <span className="mr-2 flex items-center gap-2">
                        {c.icon}
                        {c.name}
                      </span>
                      <div className={`h-3 w-3 rounded-full ${c.color}`} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="ITEM DESCRIPTION"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="py-6"
            />

            <Input
              placeholder="AMOUNT (฿)"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="py-6"
            />
          </div>

          <DialogFooter className="mt-6 flex w-full justify-between">
            <Button
              onClick={() => {
                if (!selectedDate) return

                if (editIndex !== null) {
                  const updated = [...records]
                  updated[editIndex] = {
                    ...updated[editIndex],
                    category: form.category,
                    note: form.note,
                    amount: Number(form.amount),
                  }
                  setRecords(updated)
                } else {
                  setRecords([
                    ...records,
                    {
                      date: format(selectedDate, 'yyyy-MM-dd'),
                      note: form.note,
                      amount: Number(form.amount),
                      category: form.category,
                    },
                  ])
                }

                setForm({ category: '', note: '', amount: '' })
                setEditIndex(null)
                setAddOpen(false)
              }}
              className="mr-12 flex-1 bg-green-600 px-6 py-4 font-bold hover:bg-green-700"
            >
              CONFIRM
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setForm({ category: '', note: '', amount: '' })
                setEditIndex(null)
                setAddOpen(false)
              }}
              className="flex-1 px-6 py-4 font-bold"
            >
              CANCEL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

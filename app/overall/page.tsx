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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Utensils,
  Car,
  ShoppingBag,
  Calendar,
} from 'lucide-react'
import HpStatusBar from '@/components/overall/HpStatusBar'
import ResultModal from '@/components/overall/ResultModal'

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

export default function Overall() {
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

        <HpStatusBar
          remaining={remaining}
          percentLeft={percentLeft}
          statusMessage={statusMessage}
          textColor={textColor}
        />
      </div>

      {/* Main Modal */}
      <ResultModal
        open={open}
        setOpen={setOpen}
        selectedDate={selectedDate}
        selectedDayKey={selectedDayKey}
        records={records}
        setRecords={setRecords}
        categories={categories}
        selectedDayNote={selectedDayNote}
        dayNotes={dayNotes}   
        setDayNotes={setDayNotes}
        form={form}
        setForm={setForm}
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        setAddOpen={setAddOpen}
      />

    </div>
  )
}
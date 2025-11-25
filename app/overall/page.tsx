'use client'

import { useState } from 'react'
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
import { Calendar } from 'lucide-react'
import HpStatusBar from '@/components/overall/HpStatusBar'
import ResultModal from '@/components/overall/ResultModal'
import { useEventsStore } from '@/store/useEventsStore'
import { CATEGORY_OPTIONS, Category } from '@/constants/categories'

export default function Overall() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  const [dayNotes, setDayNotes] = useState<Record<string, string>>({})

  const eventsStore = useEventsStore()
  const getEventsByDate = eventsStore.getEventsByDate

  const [form, setForm] = useState({
    category: '',
    note: '',
    amount: '',
  })

  const totalDays = getDaysInMonth(new Date(year, month))
  const startDate = startOfMonth(new Date(year, month))
  const days = Array.from({ length: totalDays }, (_, i) =>
    addDays(startDate, i),
  )

  const selectedDayKey = selectedDate
    ? format(selectedDate, 'yyyy-MM-dd')
    : null

  const selectedDayNote = selectedDayKey ? (dayNotes[selectedDayKey] ?? '') : ''

  const monthlyEvents = Object.values(eventsStore.events)
    .flat()
    .filter(
      (ev) =>
        format(new Date(ev.date), 'yyyy-MM') ===
        format(new Date(year, month), 'yyyy-MM'),
    )

  const monthlyTotal = monthlyEvents.reduce((sum, r) => sum + r.amount, 0)

  const [monthlyBudget, setMonthlyBudget] = useState(20000)
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
        {/* Calendar Title */}
        <div className="col-span-2 flex items-center justify-center gap-4">
          <Calendar size={42} className="text-gray-700" />
          <div className="flex items-center text-4xl font-bold tracking-wide text-black md:text-6xl">
            <span className="mr-3 text-2xl font-medium md:text-3xl">
              {format(new Date(year, month), 'MMMM')
                .toUpperCase()
                .split('')
                .join(' ')}
            </span>
            <span className="text-2xl font-bold md:text-3xl">
              {format(new Date(year, month), 'yyyy')}
            </span>
          </div>
        </div>

        {/* Days */}
        {days.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd')
          const dayEvents = getEventsByDate(dayKey)
          const uniqueCats = Array.from(
            new Set(dayEvents.map((ev) => ev.category)),
          )

          return (
            <div
              key={dayKey}
              onClick={() => {
                setSelectedDate(day)
                setOpen(true)
              }}
              className={`group relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-sm p-3 shadow-sm transition-colors duration-300 hover:shadow-lg ${
                isToday(day)
                  ? 'bg-gradient-to-br from-[#4ae6b7] via-[#6fd6b7] to-[#b8f0f1] hover:from-[#a4e4ce] hover:via-[#2ddd97] hover:to-[#15db96]'
                  : 'bg-[#AE7BDA] hover:bg-[#CBA3EE]'
              }`}
            >
              {/* Category badges */}
              {uniqueCats.length > 0 && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {uniqueCats.map((catId) => {
                    const catObj = CATEGORY_OPTIONS.find((c) => c.id === catId)
                    if (!catObj) return null
                    return (
                      <div
                        key={catId}
                        className="h-4 w-4 rounded-full border border-black"
                        style={{ backgroundColor: catObj.color }}
                      />
                    )
                  })}
                </div>
              )}

              {/* Day text */}
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

      {/* Modal */}
      <ResultModal
        open={open}
        setOpen={setOpen}
        selectedDate={selectedDate}
        selectedDayKey={selectedDayKey}
        selectedDayNote={selectedDayNote}
        dayNotes={dayNotes}
        setDayNotes={setDayNotes}
        form={form}
        setForm={setForm}
        editId={editId}
        setEditId={setEditId}
        setAddOpen={setAddOpen}
      />
    </div>
  )
}

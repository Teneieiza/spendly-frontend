'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useCalendarStore } from '@/store/useCalendarStore'
import { useEventsStore, EventItem } from '@/store/useEventsStore'
import CalendarModal from './CalendarModal'
import { format } from 'date-fns'

const hours = Array.from({ length: 23 }, (_, i) => i + 1)

export default function TimeGrid() {
  const { weekStart } = useCalendarStore()
  const eventsStore = useEventsStore()
  const getEventsByDate = eventsStore.getEventsByDate
  const addEvent = eventsStore.addEvent

  const containerRef = useRef<HTMLDivElement | null>(null)
  const cellRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const [modalState, setModalState] = useState({
    open: false,
    anchorRect: null as DOMRect | null,
    side: 'right' as 'left' | 'right',
    direction: 'down' as 'up' | 'down',
    date: null as string | null,
    hour: null as number | null,
  })

  const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd')
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const eventsForDate = (dateStr: string) =>
    getEventsByDate(dateStr) as EventItem[]

  const handleCellClick = (
    e: React.MouseEvent,
    dayIndex: number,
    hour: number,
  ) => {
    const target = e.currentTarget as HTMLDivElement
    const anchorRect = target.getBoundingClientRect()
    const side = dayIndex <= 2 ? 'right' : 'left'
    const dateStr = formatDateKey(days[dayIndex])

    setModalState({
      open: true,
      anchorRect,
      side,
      direction: 'down',
      date: dateStr,
      hour,
    })
  }

  const closeModal = () => setModalState((s) => ({ ...s, open: false }))
  const handleSave = (payload: Omit<EventItem, 'id'>) => addEvent(payload)

  const now = new Date()
  const nowDateKey = format(now, 'yyyy-MM-dd')
  const nowHour = now.getHours() === 0 ? 24 : now.getHours()

  useEffect(() => {
    const nowKey = `${days.findIndex(
      (d) => formatDateKey(d) === nowDateKey,
    )}-${nowHour}`
    const el = cellRefs.current[nowKey]
    if (el && containerRef.current) {
      containerRef.current.scrollTo({
        top: el.offsetTop - 64,
        behavior: 'smooth',
      })
    }
  }, [weekStart])

  return (
    <div
      ref={containerRef}
      className="relative grid h-[calc(100vh-13rem)] w-full [grid-template-columns:repeat(8,198px)] divide-x divide-gray-200 overflow-y-auto bg-white"
    >
      {/* Left: Time column */}
      <div className="flex flex-col border-r bg-white">
        {hours.map((h) => (
          <div
            key={h}
            className="flex h-16 items-start border-t pl-2 text-xs text-gray-400"
          >
            {h > 12 ? `${h - 12} PM` : `${h} AM`}
          </div>
        ))}
      </div>

      {/* Right: 7 days columns */}
      {days.map((d, dayIndex) => {
        const dateKey = formatDateKey(d)
        const events = eventsForDate(dateKey)

        return (
          <div key={dayIndex} className="relative flex flex-col bg-white">
            {hours.map((h) => {
              const cellKey = `${dayIndex}-${h}`
              const cellEvents = events.filter((ev) => ev.hour === h)
              const isCurrent = dateKey === nowDateKey && h === nowHour

              return (
                <div
                  key={h}
                  ref={(el) => {
                    cellRefs.current[cellKey] = el
                  }}
                  onClick={(e) => handleCellClick(e, dayIndex, h)}
                  className="relative h-16 cursor-pointer border-t border-gray-100 p-2 text-sm hover:bg-gray-50"
                  style={{
                    outline: isCurrent ? '2px solid #FB923C' : undefined,
                  }}
                >
                  {cellEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="mb-1 flex items-center justify-between rounded-md border px-2 py-1"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ backgroundColor: ev.color }}
                        />
                        <div className="text-xs font-semibold">{ev.title}</div>
                      </div>
                      <div className="text-xs font-medium">
                        {ev.type === 'income' ? '+' : '-'}
                        {ev.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Modal */}
      {modalState.open &&
        modalState.anchorRect &&
        modalState.date &&
        modalState.hour && (
          <CalendarModal
            open={modalState.open}
            anchorRect={modalState.anchorRect}
            side={modalState.side}
            direction={modalState.direction}
            initial={{ date: modalState.date, hour: modalState.hour }}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
    </div>
  )
}

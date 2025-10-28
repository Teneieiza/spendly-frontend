'use client'

import WeekHeader from '@/components/calendar/WeekHeader'
import TimeGrid from '@/components/calendar/TimeGrid'

export default function ExpensePage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white">
        <WeekHeader />
      </div>

      <TimeGrid />
    </div>
  )
}

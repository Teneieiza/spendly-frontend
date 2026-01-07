'use client'

import WeekHeader from '@/components/expense/WeekHeader'
import TimeGrid from '@/components/expense/TimeGrid'
import { Session } from 'next-auth'

type Props = {
  session: Session | null
}

export default function ExpenseClient({ session }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-white">
        <WeekHeader />
      </div>
      <TimeGrid />
    </div>
  )
}

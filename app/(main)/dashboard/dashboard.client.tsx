'use client'

import { Session } from 'next-auth'

type Props = {
  session: Session | null
}

export default function DashboardClient({ session }: Props) {
  return (
    <div className="flex h-full items-center justify-center">
      <h1>Dashboard</h1>
    </div>
  )
}

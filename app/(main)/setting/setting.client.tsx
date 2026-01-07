'use client'

import { Session } from 'next-auth'

type Props = {
  session: Session | null
}

export default function SettingClient({ session }: Props) {
  return (
    <div className="flex h-full items-center justify-center">
      <h1>Setting</h1>
    </div>
  )
}

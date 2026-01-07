'use client'

import { ReactNode } from 'react'

type Props = {
  left: ReactNode
  title: ReactNode
  children: ReactNode
}

export function AuthLayout({ left, title, children }: Props) {
  return (
    <div className="mx-4 grid w-full max-w-md grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl md:max-w-4xl md:grid-cols-2">
      {/* LEFT */}
      <div className="hidden cursor-default md:flex">{left}</div>

      {/* RIGHT */}
      <div className="flex flex-col justify-center p-8">
        <h2 className="mb-6 cursor-default text-2xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  )
}

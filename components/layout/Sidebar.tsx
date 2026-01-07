'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import {
  Wallet,
  Settings,
  ChevronDown,
  Menu,
  BadgeDollarSign,
  ChartColumn,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useCalendarStore } from '@/store/useCalendarStore'
import { Calendar } from '@/components/ui/calendar'
import { startOfWeek, endOfWeek } from 'date-fns'

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const [showGeneral, setShowGeneral] = useState(true)
  const [showSetting, setShowSetting] = useState(true)

  const currentDate = useCalendarStore((s) => s.currentDate)
  const setState = useCalendarStore.setState

  return (
    <div
      className={cn(
        'z-50 h-full border-r border-gray-200 bg-white shadow-md transition-all',
        open ? 'w-64' : 'w-22',
      )}
    >
      <div className="flex h-full flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex h-18 items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <BadgeDollarSign size={24} />
              {open && <span className="text-lg font-semibold">Spendly</span>}
            </div>
            <button onClick={() => setOpen(!open)} className="text-gray-600">
              <Menu size={20} />
            </button>
          </div>

          {/* General Section */}
          <div className="mt-4">
            <button
              className="flex w-full items-center justify-between py-2 pr-4 pl-3 text-sm font-semibold text-gray-600"
              onClick={() => setShowGeneral(!showGeneral)}
            >
              <div className="flex items-center gap-2 text-gray-400">
                <span>GENERAL</span>
              </div>
              {open && (
                <ChevronDown
                  className={cn(
                    'transition-transform',
                    showGeneral ? 'rotate-180' : '',
                  )}
                  size={18}
                />
              )}
            </button>

            {showGeneral && (
              <div className="ml-6 flex flex-col gap-1 font-semibold">
                <SidebarLink
                  open={open}
                  pathname={pathname}
                  href="/dashboard"
                  icon={<ChartColumn size={18} />}
                  label="Dashboard"
                />
                <SidebarLink
                  open={open}
                  pathname={pathname}
                  href="/expense"
                  icon={<Wallet size={18} />}
                  label="Expense"
                />
                <SidebarLink
                  open={open}
                  pathname={pathname}
                  href="/overall"
                  icon={<Wallet size={18} />}
                  label="Overall"
                />
              </div>
            )}
          </div>

          {/* Setting Section */}
          <div className="mt-4">
            <button
              className="flex w-full items-center justify-between py-2 pr-4 pl-3 text-sm font-semibold text-gray-600"
              onClick={() => setShowSetting(!showSetting)}
            >
              <div className="flex items-center gap-2 text-gray-400">
                <span>SUPPORT</span>
              </div>
              {open && (
                <ChevronDown
                  className={cn(
                    'transition-transform',
                    showSetting ? 'rotate-180' : '',
                  )}
                  size={18}
                />
              )}
            </button>

            {showSetting && (
              <div className="mt-1 ml-6 space-y-1 font-semibold">
                <SidebarLink
                  open={open}
                  pathname={pathname}
                  href="/setting"
                  icon={<Settings size={18} />}
                  label="Setting"
                />
              </div>
            )}
          </div>

          {/* Calendar เฉพาะหน้า Expense */}
          {open && pathname === '/expense' && (
            <div className="mt-8 border-t">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => {
                  if (!date) return
                  setState({
                    currentDate: date,
                    weekStart: startOfWeek(date, { weekStartsOn: 0 }),
                    weekEnd: endOfWeek(date, { weekStartsOn: 0 }),
                  })
                }}
              />
            </div>
          )}
        </div>

        {/* Logout */}
        <div onClick={() => signOut({ callbackUrl: '/login' })} className="mb-4 px-4 font-bold">
          <button className="flex w-full items-center justify-center cursor-pointer rounded-md bg-gray-100 py-2 text-sm drop-shadow-lg transition-colors hover:bg-gray-200">
            {open ? 'LOGOUT' : <LogOut size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

// แยก component ย่อยให้สะอาดขึ้น
function SidebarLink({ href, icon, label, pathname, open }: any) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100',
        open ? 'w-[90%]' : 'w-[70%]',
        pathname === href ? 'bg-gray-200 font-bold' : 'text-gray-700',
      )}
    >
      {open ? (
        <span className="flex gap-2">
          {icon} {label}
        </span>
      ) : (
        icon
      )}
    </Link>
  )
}

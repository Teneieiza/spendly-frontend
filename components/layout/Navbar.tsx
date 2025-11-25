'use client'

import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react'
import { useCalendarStore } from '@/store/useCalendarStore'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const { goToday, prevWeek, nextWeek, getMonthLabel } = useCalendarStore()

  return (
    <nav className="bg-background flex h-18 items-center justify-between border-b px-4">
      {/* Left: Search */}
      <div className="flex w-full gap-3">
        <div className="flex w-full max-w-lg items-center space-x-2">
          <Input type="text" placeholder="Search..." className="w-full" />
        </div>
        {pathname === '/expense' && (
          <div className="bg-background flex items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={goToday}>
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={prevWeek}>
                <ChevronLeft />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextWeek}>
                <ChevronRight />
              </Button>
            </div>
            <div className="text-lg font-semibold">{getMonthLabel()}</div>
          </div>
        )}
      </div>

      {/* Right: Notification + User */}
      <div className="mr-6 flex items-center space-x-6">
        {/* Notification */}
        <button className="hover:bg-muted relative rounded-full p-2 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs text-white">
            3
          </span>
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-12 w-12 cursor-pointer">
              <AvatarImage src="/avatars/user.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

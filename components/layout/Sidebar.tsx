// components/sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart, Wallet, Settings, ChevronDown, Menu, BadgeDollarSign, ChartColumn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [showGeneral, setShowGeneral] = useState(true);
  const [showSetting, setShowSetting] = useState(true);

  return (
    <div
      className={cn(
        "h-full bg-white shadow-md transition-all border-r border-gray-200 z-50",
        open ? "w-64" : "w-22"
      )}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between p-4 border-b h-18">
            <div className="flex items-center gap-2">
              <BadgeDollarSign size={24}/>
              {open && <span className="font-semibold text-lg">Spendly</span>}
            </div>
            <button onClick={() => setOpen(!open)} className="text-gray-600">
              <Menu size={20} />
            </button>
          </div>


          {/* General Section */}
          <div className="mt-4">
            <button
              className="flex items-center justify-between w-full pl-3 pr-4 py-2 text-sm font-semibold text-gray-600"
              onClick={() => setShowGeneral(!showGeneral)}
            >
              <div className="flex items-center gap-2 text-gray-400">
                <span>GENERAL</span>
              </div>
              {open && (
                <ChevronDown
                  className={cn("transition-transform", showGeneral ? "rotate-180" : "")}
                  size={18}
                />
              )}
            </button>

            {showGeneral && (
              <div className="ml-6 flex flex-col font-semibold">
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors",
                    open ? "w-[90%]" : "w-[70%]",
                    pathname === "/dashboard" ? "bg-gray-200 font-bold" : "text-gray-700"
                  )}
                >
                  {open ? <span className="flex gap-2"><ChartColumn size={18} /> Dashboard</span>: <ChartColumn size={18} />}
                </Link>
                <Link
                  href="/expense"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors",
                    open ? "w-[90%]" : "w-[70%]",
                    pathname === "/expense" ? "bg-gray-200 font-bold" : "text-gray-700"
                  )}
                >
                  {open ? <span className="flex gap-2"> <Wallet size={18}/> Expense</span>: <Wallet size={18}/>}
                </Link>
              </div>
            )}
          </div>


          {/* Setting Section */}
          <div className="mt-4">
            <button
              className="flex items-center justify-between w-full pl-3 pr-4 py-2 text-sm font-semibold text-gray-600"
              onClick={() => setShowSetting(!showSetting)}
            >
              <div className="flex items-center gap-2 text-gray-400">
                <span>SUPPORT</span>
              </div>
              {open && (
                <ChevronDown
                  className={cn("transition-transform", showSetting ? "rotate-180" : "")}
                  size={18}
                />
              )}
            </button>

            {showSetting &&(
              <div className="ml-6 mt-1 space-y-1 font-semibold">
                <Link
                  href="/setting"
                    className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors",
                    open ? "w-[90%]" : "w-[70%]",
                    pathname === "/setting" ? "bg-gray-200 font-bold" : "text-gray-700"
                  )}
                >
                  {open ? <span className="flex gap-2"> <Settings size={18}/> Setting</span>: <Settings size={18}/>}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 mb-4 font-bold">
          <button className="w-full flex justify-center items-center bg-gray-100 py-2 text-sm rounded-md hover:bg-gray-200 transition-colors drop-shadow-lg">
            {open ? "LOGOUT" : <LogOut size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

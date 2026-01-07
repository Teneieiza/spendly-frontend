// import "./globals.css";

import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
        <div className="w-full max-h-screen m-5 bg-white border border-gray-200 shadow-sm rounded-2xl flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="p-6 bg-[#f9fafb] flex-1 overflow-hidden">{children}</main>
          </div>
        </div>
  )
}


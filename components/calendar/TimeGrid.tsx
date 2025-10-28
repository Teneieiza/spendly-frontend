'use client'

const hours = Array.from({ length: 23 }, (_, i) => i + 1) // 1AM - 11PM

export default function TimeGrid() {
  return (
    <div className="grid w-full grid-cols-8 divide-x divide-gray-200">
      {/* Left: Time column */}
      <div className="flex flex-col border-r">
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
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex flex-col">
          {hours.map((_, idx) => (
            <div key={idx} className="h-16 border-t border-gray-100"></div>
          ))}
        </div>
      ))}
    </div>
  )
}

'use client'

import React from 'react'
import { CircleAlert } from 'lucide-react'

export default function HpStatusBar({
  remaining,
  percentLeft,
  statusMessage,
  textColor,
}: {
  remaining: number
  percentLeft: number
  statusMessage: string
  textColor: string
}) {
  return (
    <div className="fixed right-11 bottom-16 flex h-32 w-110 flex-col justify-center gap-2 rounded-lg border-2 border-black bg-white px-6 shadow-lg z-50">
      <div className="absolute top-1 right-1">
        <div className="group relative cursor-pointer">
          <span className="text-lg font-bold text-red-600">
            <CircleAlert size={20} />
          </span>
          <div className="pointer-events-none absolute -top-20 -right-2 w-80 rounded-md bg-gray-900 px-6 py-6 text-sm font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Spend wisely to keep your HP healthy!
          </div>
        </div>
      </div>

      <div className="flex items-center text-md font-bold text-black">
        <p className="flex items-start justify-start">NAME:</p>
        <p className="ml-40">MONEY: {remaining} ฿</p>
      </div>

      <div className="flex w-full items-center justify-start gap-2">
        <p className="text-lg font-bold">HP: </p>
        <div className="relative h-5 w-full overflow-hidden rounded-full border border-black bg-gray-200">
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: `${percentLeft}%`,
              transition: 'width 0.5s ease-in-out',
              backgroundImage:
                percentLeft <= 0
                  ? 'linear-gradient(270deg, #dc2626, #b91c1c, #dc2626)'
                  : percentLeft < 30
                    ? 'linear-gradient(270deg, #dc2626, #b91c1c, #dc2626)'
                    : percentLeft < 50
                      ? 'linear-gradient(270deg, #f97316, #ea580c, #f97316)'
                      : percentLeft < 70
                        ? 'linear-gradient(270deg, #facc15, #eab308, #facc15)'
                        : 'linear-gradient(270deg, #22c55e, #16a34a, #22c55e)',
              backgroundSize: '600% 100%',
              backgroundPosition: '0% 50%',
              animation: 'gradientShift 3s linear infinite',
            }}
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full w-1 rounded-full opacity-70 blur-sm"
                style={{
                  left: `${i * 6 + Math.random() * 5}%`,
                  backgroundColor:
                    percentLeft < 50
                      ? 'rgba(220,38,38,0.6)'
                      : 'rgba(34,197,94,0.6)',
                  animation: `particleMove ${
                    1 + Math.random() * 2
                  }s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <p
        className={`text-md flex items-center justify-center font-bold ${textColor}`}
      >
        {statusMessage}
      </p>

      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes particleMove {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

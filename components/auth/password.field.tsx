'use client'

import { useState } from 'react'
import { Eye, EyeOff, ArrowBigUpDash } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Props = {
  placeholder: string
  register: any
  error?: string
  shake?: boolean
}

export function PasswordField({
  placeholder,
  register,
  error,
  shake,
}: Props) {
  const [show, setShow] = useState(false)
  const [capsLock, setCapsLock] = useState(false)

  return (
    <div>
      <div className="relative">
        <Input
          placeholder={placeholder}
          type={show ? 'text' : 'password'}
          {...register}
          onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}
          className={`pr-16 ${shake ? 'animate-shake' : ''}`}
        />

        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2 text-muted-foreground">
          {capsLock && (
            <ArrowBigUpDash
              size={18}
              className="text-purple-500"
              strokeWidth={2.5}
            />
          )}

          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            className="hover:text-foreground cursor-pointer"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="mt-1 min-h-[16px] text-xs text-red-500">{error}</div>
    </div>
  )
}

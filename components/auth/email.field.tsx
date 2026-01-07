'use client'

import { Input } from '@/components/ui/input'

type Props = {
  register: any
  error?: string
  shake?: boolean
}

export function EmailField({ register, error, shake }: Props) {
  return (
    <div>
      <Input
        placeholder="Email"
        type="email"
        {...register}
        className={shake ? 'animate-shake' : ''}
      />

      <div className="mt-1 min-h-[16px] text-xs text-red-500">{error}</div>
    </div>
  )
}

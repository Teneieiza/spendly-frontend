'use client'

import { Rule } from '@/components/auth/register/register.checklist.icon'
import { passwordRules } from '@/lib/register/register.rules'

type Props = {
  email: string
  password: string
  confirm: string
}

export function RegisterChecklist({ email, password, confirm }: Props) {
  return (
    <div className="rounded-lg bg-purple-50 px-4 py-6">
      <h3 className="mb-2 text-sm font-semibold text-purple-600">
        Account requirements
      </h3>

      <ul className="space-y-2">
        <Rule
          label="Use a valid email address"
          passed={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
        />
        <Rule
          label="Password must be at least 8 characters"
          passed={passwordRules.length(password)}
        />
        <Rule
          label="Include uppercase letter"
          passed={passwordRules.upper(password)}
        />
        <Rule
          label="Include lowercase letter"
          passed={passwordRules.lower(password)}
        />
        <Rule
          label="Include at least one number"
          passed={passwordRules.number(password)}
        />
        <Rule
          label="Confirm password must match"
          passed={password.length > 0 && password === confirm}
        />
      </ul>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { registerSchema, RegisterForm } from '@/lib/register/register.schema'
import { passwordRules } from '@/lib/register/register.rules'
import { Rule } from '@/components/auth/register.checklist'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { GoogleIcon } from '@/components/icons/google'
import { signIn } from 'next-auth/react'
import { ArrowBigUpDash, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [capsLock, setCapsLock] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const email = watch('email') || ''
  const password = watch('password') || ''
  const confirm = watch('confirmPassword') || ''

  const onSubmit = async (data: RegisterForm) => {
    setSubmitted(true)

    // // call register API
    // console.log(data)
  }

  return (
    <div className="mx-4 grid w-full max-w-md grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl md:max-w-4xl md:grid-cols-2">
      {/* LEFT */}
      <div className="hidden cursor-default flex-col justify-center bg-purple-600 px-10 text-white md:flex">
        <p className="font-semibold">Start your journey</p>
        <h1 className="mb-3 text-4xl">CREATE ACCOUNT</h1>

        <div className="mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-purple-200 to-purple-400" />
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
      </div>

      {/* RIGHT */}
      <div className="flex flex-col justify-center p-8">
        <h2 className="mb-6 cursor-default text-2xl font-bold">
          REGISTER <span className="text-purple-600">SPENLY</span>
        </h2>

        <form
          className="space-y-3"
          onSubmit={handleSubmit(onSubmit, () => setSubmitted(true))}
        >
          {/* EMAIL */}
          <div>
            <Input
              placeholder="Email"
              type="email"
              {...register('email', {
                onChange: () => submitted && clearErrors('email'),
              })}
              className={submitted && errors.email ? 'animate-shake' : ''}
            />
            <div className="mt-1 min-h-[16px] text-xs text-red-500">
              {submitted && errors.email?.message}
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <div className="relative">
              <Input
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  onChange: () => submitted && clearErrors('password'),
                })}
                onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                className={`pr-16 ${submitted && errors.password ? 'animate-shake' : ''}`}
              />

              {/* ICONS */}
              <div className="text-muted-foreground absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
                {capsLock && (
                  <ArrowBigUpDash
                    size={18}
                    className="text-purple-500"
                    strokeWidth={2.5}
                  />
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="hover:text-foreground cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="mt-1 min-h-[16px] text-xs text-red-500">
              {submitted && errors.password?.message}
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <div className="relative">
              <Input
                placeholder="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmPassword', {
                  onChange: () => submitted && clearErrors('confirmPassword'),
                })}
                onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                className={`pr-16 ${
                  submitted && errors.confirmPassword ? 'animate-shake' : ''
                }`}
              />

              {/* ICONS */}
              <div className="text-muted-foreground absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
                {capsLock && (
                  <ArrowBigUpDash
                    size={18}
                    className="text-purple-500"
                    strokeWidth={2.5}
                  />
                )}

                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="hover:text-foreground cursor-pointer"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="mt-1 min-h-[16px] text-xs text-red-500">
              {submitted && errors.confirmPassword?.message}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700"
          >
            Create Account
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="flex w-full cursor-pointer gap-2"
            onClick={() =>
              signIn('google', {
                callbackUrl: '/dashboard',
              })
            }
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-medium text-purple-600 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

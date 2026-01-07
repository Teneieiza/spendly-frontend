'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { GoogleIcon } from '@/components/icons/google'
import { Eye, EyeOff, ArrowBigUpDash } from 'lucide-react'

/* ------------------ schema ------------------ */
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .trim()
    .min(1, 'Password is required.')
    .min(8, 'Password must be at least 8 characters.'),
  remember: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const [authError, setAuthError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const onSubmit = async (data: LoginForm) => {
    setSubmitted(true)
    setAuthError('')

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (!res?.ok) {
      setAuthError('Email or password is incorrect.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="mx-4 grid w-full max-w-md grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl md:max-w-4xl md:grid-cols-2">
      {/* LEFT */}
      <div className="hidden cursor-default flex-col items-center justify-center bg-purple-600 px-10 text-white md:flex">
        <p className="font-semibold">Nice to see you again</p>
        <h1 className="mb-3 text-4xl">WELCOME BACK</h1>
        <div className="mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-purple-200 to-purple-400" />
        <p className="text-center text-purple-100">
          Track smarter. Spend better.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col justify-center p-8">
        <h2 className="mb-6 cursor-default text-2xl font-bold">
          LOGIN TO <span className="text-purple-600">SPENLY</span>
        </h2>

        <form
          className="space-y-2"
          onSubmit={handleSubmit(onSubmit, () => setSubmitted(true))}
        >
          {/* EMAIL */}
          <div>
            <Input
              placeholder="Email"
              type="email"
              {...register('email', {
                onChange: () => {
                  if (submitted) {
                    clearErrors('email')
                    setAuthError('')
                  }
                },
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
                  onChange: () => {
                    if (submitted) {
                      clearErrors('password')
                      setAuthError('')
                    }
                  },
                })}
                onKeyDown={(e) => {
                  setCapsLock(e.getModifierState('CapsLock'))
                }}
                className={
                  submitted && errors.password ? 'animate-shake pr-16' : 'pr-16'
                }
              />

              {/* ICONS */}
              <div className="text-muted-foreground absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
                {/* Caps Lock Icon */}
                {capsLock && (
                  <ArrowBigUpDash
                    size={18}
                    className="text-purple-500"
                    strokeWidth={2.5}
                  />
                )}

                {/* Show / Hide Password */}
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

            {/* ERROR (password + auth) */}
            <div
              className={`mt-1 min-h-[16px] text-xs text-red-500 ${
                submitted && authError && !errors.password
                  ? 'animate-shake'
                  : ''
              }`}
            >
              {submitted && (errors.password?.message || authError)}
            </div>
          </div>

          {/* REMEMBER ME */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register('remember')}
              className="cursor-pointer accent-purple-600"
            />
            Remember me
          </label>

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground cursor-default text-xs">
              OR
            </span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="flex w-full gap-2"
            onClick={() => signIn('google')}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don’t have an account?{' '}
          <a
            href="/register"
            className="font-medium text-purple-600 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

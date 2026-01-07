'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { loginSchema, LoginForm } from '@/lib/login/login.schema'

import { AuthLayout } from '@/components/auth/auth.layout'
import { EmailField } from '@/components/auth/email.field'
import { PasswordField } from '@/components/auth/password.field'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GoogleIcon } from '@/components/icons/google'

export default function LoginPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [authError, setAuthError] = useState('')

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

    if (res?.error) {
      setAuthError('Email or password is incorrect.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <AuthLayout
      title={
        <>
          LOGIN TO <span className="text-purple-600">SPENLY</span>
        </>
      }
      left={
        <div className="flex w-full flex-col items-center justify-center bg-purple-600 px-10 text-white">
          <p className="font-semibold">Nice to see you again</p>
          <h1 className="mb-3 text-4xl">WELCOME BACK</h1>
          <div className="mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-purple-200 to-purple-400" />
          <p className="text-center text-purple-100">
            Track smarter. Spend better.
          </p>
        </div>
      }
    >
      <form
        className="space-y-3"
        onSubmit={handleSubmit(onSubmit, () => setSubmitted(true))}
      >
        {/* EMAIL */}
        <EmailField
          register={register('email', {
            onChange: () => {
              if (submitted) {
                clearErrors('email')
                setAuthError('')
              }
            },
          })}
          error={submitted ? errors.email?.message : undefined}
          shake={submitted && !!errors.email}
        />

        {/* PASSWORD */}
        <PasswordField
          placeholder="Password"
          register={register('password', {
            onChange: () => {
              if (submitted) {
                clearErrors('password')
                setAuthError('')
              }
            },
          })}
          error={submitted ? (errors.password?.message || authError) : undefined}
          shake={submitted && (!!errors.password || !!authError)}
        />

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">OR</span>
          <Separator className="flex-1" />
        </div>

        {/* GOOGLE */}
        <Button
          type="button"
          variant="outline"
          className="flex w-full gap-2 cursor-pointer"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Don’t have an account?{' '}
        <a href="/register" className="font-medium text-purple-600 hover:underline">
          Sign up
        </a>
      </p>
    </AuthLayout>
  )
}

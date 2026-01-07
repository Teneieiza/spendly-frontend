'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'

import { registerSchema, RegisterForm } from '@/lib/register/register.schema'

import { AuthLayout } from '@/components/auth/auth.layout'
import { EmailField } from '@/components/auth/email.field'
import { PasswordField } from '@/components/auth/password.field'
import { RegisterChecklist } from '@/components/auth/register/register.checklist.form'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GoogleIcon } from '@/components/icons/google'

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false)

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
    // call register API
    // console.log(data)
  }

  return (
    <AuthLayout
      title={
        <>
          REGISTER <span className="text-purple-600">SPENLY</span>
        </>
      }
      left={
        <div className="flex w-full flex-col justify-center bg-purple-600 px-10 text-white">
          <p className="font-semibold">Start your journey</p>
          <h1 className="mb-3 text-4xl">CREATE ACCOUNT</h1>

          <div className="mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-purple-200 to-purple-400" />

          <RegisterChecklist
            email={email}
            password={password}
            confirm={confirm}
          />
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
            onChange: () => submitted && clearErrors('email'),
          })}
          error={submitted ? errors.email?.message : undefined}
          shake={submitted && !!errors.email}
        />

        {/* PASSWORD */}
        <PasswordField
          placeholder="Password"
          register={register('password', {
            onChange: () => submitted && clearErrors('password'),
          })}
          error={submitted ? errors.password?.message : undefined}
          shake={submitted && !!errors.password}
        />

        {/* CONFIRM */}
        <PasswordField
          placeholder="Confirm Password"
          register={register('confirmPassword', {
            onChange: () => submitted && clearErrors('confirmPassword'),
          })}
          error={submitted ? errors.confirmPassword?.message : undefined}
          shake={submitted && !!errors.confirmPassword}
        />

        {/* SUBMIT */}
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
        Already have an account?{' '}
        <a href="/login" className="font-medium text-purple-600 hover:underline">
          Login
        </a>
      </p>
    </AuthLayout>
  )
}

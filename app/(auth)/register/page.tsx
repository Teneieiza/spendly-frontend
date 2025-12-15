import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { GoogleIcon } from "@/components/icons/google"

export default function Register() {
  return (
    <div className="w-full max-w-md md:max-w-4xl mx-4 bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-center items-center bg-purple-600 text-white px-10">
        <p className="font-semibold">Start your journey</p>

        <h1 className="text-4xl mb-3">CREATE ACCOUNT</h1>

        <div className="w-14 h-1.5 bg-gradient-to-r from-purple-200 to-purple-400 rounded-full mb-3" />

        <p className="text-purple-100 text-center">
          Take control of your money today.
        </p>
      </div>

      {/* RIGHT */}
      <div className="p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-6">
          REGISTER <span className="text-purple-600">SPENLY</span>
        </h2>

        <div className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Input placeholder="Confirm Password" type="password" />

          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            Create Account
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" className="w-full">
            <GoogleIcon />
            Sign in with Google
          </Button>
        </div>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

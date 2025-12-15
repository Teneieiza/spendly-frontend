import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { GoogleIcon } from "@/components/icons/google"

export default function Login() {
  return (
    <div className="w-full max-w-md md:max-w-4xl mx-4 bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-center items-center bg-purple-600 text-white px-10">
        <p className="font-semibold">Nice to see you again</p>

        <h1 className="text-4xl mb-3">WELCOME BACK</h1>

        <div className="w-14 h-1.5 bg-gradient-to-r from-purple-200 to-purple-400 rounded-full mb-3" />

        <p className="text-purple-100 text-center">
          Track smarter. Spend better.
        </p>
      </div>

      {/* RIGHT */}
      <div className="p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-6">
          LOGIN TO <span className="text-purple-600">SPENLY</span>
        </h2>

        <div className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />

          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            Login
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" className="w-full">
            <GoogleIcon />
            Continue with Google
          </Button>
        </div>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-purple-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

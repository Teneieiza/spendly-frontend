export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-white">
      {children}
    </div>
  )
}
import { CheckCircle, XCircle } from 'lucide-react'

export function Rule({ label, passed }: { label: string; passed: boolean }) {
  return (
    <li
      className={`flex items-center gap-2 text-sm transition-colors ${
        passed ? 'text-green-600' : 'text-gray-500'
      }`}
    >
      {passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
      {label}
    </li>
  )
}

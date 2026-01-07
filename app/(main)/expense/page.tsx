import { auth } from '@/auth'
import ExpenseClient from './expense.client'

export default async function ExpensePage() {
  const session = await auth()

  return <ExpenseClient session={session} />
}

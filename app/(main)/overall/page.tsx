import { auth } from '@/auth'
import OverallClient from './overall.client'

export default async function OverallPage() {
  const session = await auth()
  return <OverallClient session={session} />
}

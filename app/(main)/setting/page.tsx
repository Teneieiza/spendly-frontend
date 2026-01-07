import { auth } from '@/auth'
import SettingClient from './setting.client'

export default async function SettingPage() {
  const session = await auth()
  return <SettingClient session={session} />
}

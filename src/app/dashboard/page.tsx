import DashboardClient from './DashboardClient'
import { cookies } from 'next/headers'
import { verifyToken, JwtUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // Obtener cookies en el servidor
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  // Verificar JWT
  const user: JwtUser | null = token ? verifyToken(token) : null

  // Redirigir si no hay usuario
  if (!user) redirect('/login')

  // Pasar usuario al Client Component
  return <DashboardClient user={user} />
}

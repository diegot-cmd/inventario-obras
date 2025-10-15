import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const user = token ? verifyToken(token) : null

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-800">
        Sistema de Inventario de Obras
      </h1>
      <p className="text-gray-700 mt-2">Bienvenido, sesión activa ✅</p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { JwtUser } from '@/lib/auth'
import { Materiales } from './Materiales'
import { EntradaForm } from './EntradasForm'
import { SalidaForm } from './SalidasForm'

interface DashboardClientProps {
  user: JwtUser
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [refresh, setRefresh] = useState(0)

  const triggerRefresh = () => setRefresh((prev) => prev + 1)

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-800">Bienvenido, {user.nombre} 👷‍♂️</h1>
      <p className="text-gray-700 mt-2">Sistema de Inventario de Obras</p>

      <EntradaForm onSuccess={triggerRefresh} />
      <SalidaForm onSuccess={triggerRefresh} />
      <Materiales refresh={refresh} />
    </div>
  )
}

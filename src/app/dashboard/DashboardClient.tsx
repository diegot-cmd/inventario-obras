'use client'

import { useState } from 'react'
import { Materiales } from './Materiales' // ✅ named export corregido

interface DashboardClientProps {
  user: {
    id_usuario: number
    nombre: string
    email: string
    role: string
  }
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [refresh, setRefresh] = useState(0)

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    if (res.ok) {
      document.cookie = `token=${data.token}; path=/;`
      alert(`Bienvenido ${data.usuario.nombre}`)
      setRefresh((prev) => prev + 1) // refrescar Materiales
    } else {
      alert(data.error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user.nombre}</h1>

      {/* Formulario login de prueba */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2">
          Login
        </button>
      </div>

      {/* Materiales */}
      <Materiales refresh={refresh} />
    </div>
  )
}

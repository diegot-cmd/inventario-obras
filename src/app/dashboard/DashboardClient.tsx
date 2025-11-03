'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Materiales } from './Materiales'

interface DashboardClientProps {
  user: {
    id_usuario: number
    nombre: string
    email: string
    role: string
  }
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Registro
  const [regNombre, setRegNombre] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regRole, setRegRole] = useState('Trabajador')

  const [refresh, setRefresh] = useState(0)

  // ---------- LOGIN ----------
  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    })
    const data = await res.json()
    if (res.ok) {
      // Recarga completa para que la cookie HttpOnly (puesta por el servidor) sea leída en la carga del servidor
      window.location.href = '/'
    } else {
      alert(data.error)
    }
  }

  // ---------- REGISTRO ----------
  const handleRegister = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: regNombre,
        email: regEmail,
        password: regPassword,
        role: regRole,
      }),
    })
    const data = await res.json()
    if (res.ok || res.status === 200) {
      alert('Usuario creado: ' + data.id_usuario)
      setRegNombre('')
      setRegEmail('')
      setRegPassword('')
      setRegRole('Trabajador')
      setRefresh((prev) => prev + 1) // refrescar materiales si quieres
    } else {
      alert(data.error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user.nombre}</h1>

      {/* LOGIN */}
      <div className="mb-6 border p-4">
        <h2 className="font-bold mb-2">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className="border p-2 mr-2 mb-2 font-semibold placeholder-black/50"
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          className="border p-2 mr-2 mb-2 font-semibold placeholder-black/50"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white p-2 mb-2"
        >
          Entrar
        </button>
      </div>

      {/* REGISTRO */}
      <div className="mb-6 border p-4">
        <h2 className="font-bold mb-2">Registrar nuevo usuario</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={regNombre}
          onChange={(e) => setRegNombre(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <select
          value={regRole}
          onChange={(e) => setRegRole(e.target.value)}
          className="border p-2 mr-2 mb-2"
        >
          <option value="Trabajador">Trabajador</option>
          <option value="Gerente">Gerente</option>
        </select>
        <button
          onClick={handleRegister}
          className="bg-green-500 text-white p-2 mb-2"
        >
          Registrar
        </button>
      </div>

      {/* MATERIALES */}
      <Materiales refresh={refresh} />
    </div>
  )
}

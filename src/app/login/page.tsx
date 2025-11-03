"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // asegurarse de que la cookie enviada por el servidor sea aceptada por el navegador
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        setLoading(false)
        return
      }

  // Si todo sale bien → navegar a la página principal '/'.
  // Usamos navegación completa para asegurar que la cookie HttpOnly esté disponible en la carga del servidor.
  window.location.href = '/'
    } catch (err) {
      setError('Error del servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md mx-4">
        <form
          onSubmit={handleLogin}
          className="bg-white border border-black shadow-lg p-8 rounded-2xl w-full space-y-6"
        >
          <div className="flex flex-col items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-36 h-auto" />
            <h1 className="text-2xl font-extrabold text-center text-black">Iniciar Sesión</h1>
          </div>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}

          <div className="flex flex-col gap-3">
            <label className="text-sm text-black/80">Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                  required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm text-black/80">Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                   required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-black/70">Recuérdame</span>
            </label>
            <Link href="/register" className="text-black/70 hover:underline">Crear cuenta</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-95 transition disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>

          <div className="text-center text-sm text-black/60">© Sistema de Inventario</div>
        </form>
      </div>
    </div>
  )
}

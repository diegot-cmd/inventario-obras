"use client";
import { useState } from "react";
import Link from 'next/link'

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Trabajador")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, role }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Error al registrar')
        setLoading(false)
        return
      }

      // Auto-login after register: call login endpoint so server sets HttpOnly cookie
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      })

      if (loginRes.ok) {
        // Full reload so server can read cookie and render Home
        window.location.href = '/'
      } else {
        // If auto-login fails, redirect to login page
        window.location.href = '/login'
      }
    } catch (err) {
      setError('Error del servidor')
      setLoading(false)
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md mx-4">
        <form onSubmit={handleRegister} className="bg-white border border-black p-8 rounded-2xl w-full space-y-6">
          <div className="flex flex-col items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-36 h-auto" />
            <h1 className="text-2xl font-extrabold text-center text-black">Crear Cuenta</h1>
          </div>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}

          <div className="flex flex-col gap-2">
            <label className="text-sm text-black/80">Nombre completo</label>
            <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                 required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-black/80">Correo</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                 required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-black/80">Contraseña</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                 minLength={6} required />
          </div>

          <div className="flex items-center justify-between">
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="border border-black/20 p-2 rounded text-black">
              <option value="Trabajador">Trabajador</option>
              <option value="Gerente">Gerente</option>
              <option value="Admin">Admin</option>
            </select>
            <Link href="/login" className="text-black/70 hover:underline text-sm">¿Ya tienes cuenta?</Link>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-lg hover:opacity-95 transition disabled:opacity-50">
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}

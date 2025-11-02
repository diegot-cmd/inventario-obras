'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistrarSalida() {
  const router = useRouter()
  const [form, setForm] = useState({
    id_material: '',
    cantidad: '',
    destino: '',
    fecha_salida: '',
  })

  const [materiales, setMateriales] = useState<{ id_material: number; nombre: string }[]>([])
  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState<'success' | 'error'>('success')

  useEffect(() => {
    fetch('/api/materiales')
      .then((r) => r.json())
      .then(setMateriales)
      .catch(() => {
        setMensaje('Error al cargar materiales')
        setTipo('error')
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/salidas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setMensaje(data.error || 'No se pudo registrar')
      setTipo('error')
    } else {
      setMensaje('Salida registrada')
      setTipo('success')
      setForm({ id_material: '', cantidad: '', destino: '', fecha_salida: '' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/movimientos')} 
              className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Movimientos
            </button>
            <h1 className="text-2xl font-bold text-white">Registrar Salida de Material</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-2xl">📤</span>
              Nueva Salida de Material
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Material</label>
                <select
                  name="id_material"
                  value={form.id_material}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona material</option>
                  {materiales.map((m) => (
                    <option key={m.id_material} value={m.id_material}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={form.cantidad}
                  placeholder="Ej: 50"
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Destino</label>
                <input
                  type="text"
                  name="destino"
                  value={form.destino}
                  placeholder="Ej: Obra Norte, Almacén Central"
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Fecha de Salida</label>
                <input
                  type="date"
                  name="fecha_salida"
                  value={form.fecha_salida}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-1"
                >
                  Registrar Salida
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/movimientos')}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 transform hover:-translate-y-1"
                >
                  ← Volver
                </button>
              </div>

              {mensaje && (
                <div className={`p-4 rounded-xl ${tipo === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-300' : 'bg-red-500/20 border border-red-500/30 text-red-300'}`}>
                  {mensaje}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

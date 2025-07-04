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
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error' | ''>('')

  useEffect(() => {
    fetch('/api/materiales')
      .then((res) => res.json())
      .then((data) => setMateriales(data))
      .catch(() => {
        setMensaje('Error al cargar materiales')
        setTipoMensaje('error')
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/salidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || 'Error al registrar salida')
        setTipoMensaje('error')
      } else {
        setMensaje('✅ Salida registrada correctamente')
        setTipoMensaje('success')
        setForm({ id_material: '', cantidad: '', destino: '', fecha_salida: '' })
      }
    } catch (err) {
      console.error(err)
      setMensaje('Error al registrar salida')
      setTipoMensaje('error')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Salida de Material</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="id_material"
          value={form.id_material}
          onChange={handleChange}
          required
          className="border w-full p-2 rounded"
        >
          <option value="">Seleccione un material</option>
          {materiales.map((mat) => (
            <option key={mat.id_material} value={mat.id_material}>
              {mat.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          onChange={handleChange}
          placeholder="Cantidad"
          className="border w-full p-2 rounded"
          required
        />

        <input
          type="text"
          name="destino"
          value={form.destino}
          onChange={handleChange}
          placeholder="Destino (opcional)"
          className="border w-full p-2 rounded"
        />

        <input
          type="date"
          name="fecha_salida"
          value={form.fecha_salida}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          required
        />

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Registrar Salida
          </button>
          <button type="button" onClick={() => router.back()} className="text-gray-600 underline">
            Volver
          </button>
        </div>

        {mensaje && (
          <p className={`mt-2 text-sm ${tipoMensaje === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </form>
    </div>
  )
}

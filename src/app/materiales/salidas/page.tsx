'use client'

import { useEffect, useState } from 'react'

interface Material {
  id_material: number
  nombre: string
}

export default function SalidasPage() {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [form, setForm] = useState({
    id_material: '',
    cantidad: '',
    destino: '',
    fecha_salida: ''
  })
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    fetch('/api/materiales')
      .then((res) => res.json())
      .then((data) => setMateriales(data))
      .catch(() => setMensaje('❌ Error al cargar materiales'))
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
        body: JSON.stringify({
          ...form,
          id_material: Number(form.id_material),
          cantidad: Number(form.cantidad),
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setMensaje(`❌ ${result.error}`)
      } else {
        setMensaje('✅ Salida registrada correctamente')
        setForm({ id_material: '', cantidad: '', destino: '', fecha_salida: '' })
      }
    } catch (error) {
      console.error(error)
      setMensaje('⚠️ Error al registrar salida')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Salida de Material</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow">
        <select name="id_material" value={form.id_material} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Seleccione un material</option>
          {materiales.map(mat => (
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
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="destino"
          value={form.destino}
          onChange={handleChange}
          placeholder="Destino"
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="fecha_salida"
          value={form.fecha_salida}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Registrar Salida
        </button>

        {mensaje && (
          <p className={`text-sm mt-2 ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </form>
    </div>
  )
}

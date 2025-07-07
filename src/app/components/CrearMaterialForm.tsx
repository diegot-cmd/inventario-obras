'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CrearMaterialForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    fecha_registro: '',
    stock_actual: '',
  })

  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState<'success' | 'error'>('success')

  const unidades = ['kg', 'm', 'l', 'unidad', 'm²', 'm³', 'galón', 'saco', 'rollo']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/materiales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          precio_unitario: parseFloat(form.precio_unitario),
          stock_actual: parseInt(form.stock_actual) || 0,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || 'Error al registrar material')
        setTipo('error')
      } else {
        setMensaje('✅ Material registrado correctamente')
        setTipo('success')
        setForm({
          nombre: '',
          descripcion: '',
          unidad_medida: '',
          precio_unitario: '',
          fecha_registro: '',
          stock_actual: '',
        })
      }
    } catch (error) {
      console.error(error)
      setMensaje('Error al registrar material')
      setTipo('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del material"
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción (opcional)"
        className="w-full border p-2 rounded"
      />

      <select
        name="unidad_medida"
        value={form.unidad_medida}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Selecciona unidad de medida</option>
        {unidades.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.01"
        name="precio_unitario"
        value={form.precio_unitario}
        onChange={handleChange}
        placeholder="Precio unitario"
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="date"
        name="fecha_registro"
        value={form.fecha_registro}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        name="stock_actual"
        value={form.stock_actual}
        onChange={handleChange}
        placeholder="Stock inicial (opcional)"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Registrar Material
      </button>

      {mensaje && (
        <p className={`text-sm mt-2 ${tipo === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {mensaje}
        </p>
      )}
    </form>
  )
}

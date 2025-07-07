'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CrearMaterialForm() {
  const router = useRouter()

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    fecha_registro: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  })

  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState<'success' | 'error' | ''>('')

  const unidades = [
    'Unidad', 'Kilogramo', 'Metro', 'Metro cuadrado', 'Metro cúbico', 'Litro', 'Caja', 'Bolsa',
    'Galón', 'Paquete', 'Juego', 'Docena', 'Tonelada', 'Tambor', 'Balde'
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/materiales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
          fecha_registro: new Date().toISOString().split('T')[0],
        })
      }
    } catch (error) {
      console.error(error)
      setMensaje('Error inesperado')
      setTipo('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del material"
        value={form.nombre}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        name="descripcion"
        placeholder="Descripción (opcional)"
        value={form.descripcion}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <select
        name="unidad_medida"
        value={form.unidad_medida}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Seleccione unidad de medida</option>
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
        placeholder="Precio unitario"
        value={form.precio_unitario}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="date"
        name="fecha_registro"
        value={form.fecha_registro}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Registrar Material
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-blue-600 underline"
        >
          ← Volver
        </button>
      </div>

      {mensaje && (
        <p className={`text-sm ${tipo === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {mensaje}
        </p>
      )}
    </form>
  )
}

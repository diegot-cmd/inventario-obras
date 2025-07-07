'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CrearMaterialPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    stock_actual: '',
    fecha_registro: new Date().toISOString().split('T')[0], // hoy sin desfase
  })

  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState<'success' | 'error' | ''>('')

  const unidades = ['kg', 'm', 'm2', 'm3', 'litro', 'unidad', 'rollo', 'pza', 'bolsa', 'otros']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación simple
    if (!form.nombre || !form.unidad_medida || !form.precio_unitario) {
      setMensaje('Por favor complete los campos obligatorios')
      setTipo('error')
      return
    }

    try {
      const res = await fetch('/api/materiales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          precio_unitario: parseFloat(form.precio_unitario),
          stock_actual: parseInt(form.stock_actual) || 0,
          fecha_registro: `${form.fecha_registro}T00:00:00`, // evitar desfase
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
          stock_actual: '',
          fecha_registro: new Date().toISOString().split('T')[0],
        })
      }
    } catch (error) {
      console.error(error)
      setMensaje('Error al registrar')
      setTipo('error')
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-4">Registrar Nuevo Material</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del material"
          value={form.nombre}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />

        <input
          type="text"
          name="descripcion"
          placeholder="Descripción (opcional)"
          value={form.descripcion}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <select
          name="unidad_medida"
          value={form.unidad_medida}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        >
          <option value="">Seleccione unidad de medida</option>
          {unidades.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        <input
          type="number"
          name="precio_unitario"
          placeholder="Precio unitario"
          value={form.precio_unitario}
          onChange={handleChange}
          required
          step="0.01"
          className="border p-2 w-full rounded"
        />

        <input
          type="number"
          name="stock_actual"
          placeholder="Stock inicial"
          value={form.stock_actual}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          type="date"
          name="fecha_registro"
          value={form.fecha_registro}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <div className="flex justify-between">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Registrar Material
          </button>
          <button type="button" onClick={() => router.back()} className="text-blue-600 hover:underline">
            Cancelar
          </button>
        </div>

        {mensaje && (
          <p className={`mt-2 text-sm ${tipo === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </form>
    </div>
  )
}

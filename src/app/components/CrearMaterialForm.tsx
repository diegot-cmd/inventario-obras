'use client'

import { useState } from 'react'

export default function CrearMaterialForm() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    stock_actual: '',
    fecha_registro: new Date().toISOString().split('T')[0], // hoy
  })

  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState<'success' | 'error'>('success')

  const unidadesMedida = [
    'Unidad', 'Kilogramo', 'Metro', 'Metro cuadrado', 'Metro cúbico',
    'Litro', 'Galón', 'Pieza', 'Caja', 'Bolsa', 'Tambor',
  ]

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
          stock_actual: parseInt(form.stock_actual),
          fecha_registro: new Date(form.fecha_registro).toISOString(), // evita desfase
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
      setMensaje('Ocurrió un error al registrar')
      setTipo('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del material"
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción (opcional)"
        className="w-full p-2 border rounded"
      />

      <select
        name="unidad_medida"
        value={form.unidad_medida}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Seleccione unidad de medida</option>
        {unidadesMedida.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>

      <input
        type="number"
        name="precio_unitario"
        value={form.precio_unitario}
        onChange={handleChange}
        placeholder="Precio unitario"
        step="0.01"
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        name="stock_actual"
        value={form.stock_actual}
        onChange={handleChange}
        placeholder="Stock inicial"
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="date"
        name="fecha_registro"
        value={form.fecha_registro}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
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

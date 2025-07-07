'use client'

import { useState } from 'react'

export default function RegistrarMaterial() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    fecha_registro: '',
  })
  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState<'success' | 'error'>('success')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/materiales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setMensaje(data.error || 'Error al registrar')
      setTipo('error')
    } else {
      setMensaje('Material registrado correctamente')
      setTipo('success')
      setForm({ nombre: '', descripcion: '', unidad_medida: '', precio_unitario: '', fecha_registro: '' })
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Material</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
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
          <option value="">Selecciona unidad</option>
          <option value="unidad">Unidad</option>
          <option value="bolsa">Bolsa</option>
          <option value="kilo">Kilo</option>
          <option value="litro">Litro</option>
          <option value="metro">Metro</option>
          <option value="metro cúbico">Metro cúbico</option>
          <option value="galón">Galón</option>
          <option value="tabla">Tabla</option>
          <option value="rollo">Rollo</option>
          <option value="paquete">Paquete</option>
          <option value="otro">Otro</option>
        </select>

        <input
          type="number"
          name="precio_unitario"
          value={form.precio_unitario}
          onChange={handleChange}
          placeholder="Precio unitario"
          className="w-full border p-2 rounded"
          step="0.01"
          required
        />

        <input
          type="date"
          name="fecha_registro"
          value={form.fecha_registro}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-between items-center">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Registrar
          </button>
          <a href="/materiales" className="text-blue-600 hover:underline">← Volver</a>
        </div>

        {mensaje && (
          <p className={`mt-2 text-sm ${tipo === 'success' ? 'text-green-600' : 'text-red-600'}`}>{mensaje}</p>
        )}
      </form>
    </div>
  )
}

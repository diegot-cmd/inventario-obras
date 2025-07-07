'use client'

import { useState, useEffect } from 'react'

export default function CrearMaterialForm() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    fecha_registro: '',
  })

  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState<'success' | 'error'>('success')

  useEffect(() => {
    // Corrige la fecha para evitar desfase horario (UTC-5, por ejemplo)
    const hoy = new Date()
    const fechaLocal = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10) // formato yyyy-mm-dd
    setForm((prev) => ({ ...prev, fecha_registro: fechaLocal }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
        fecha_registro: '', // puedes dejar vacío o volver a establecer la fecha actual
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
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
        step="0.01"
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="date"
        name="fecha_registro"
        value={form.fecha_registro}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Registrar Material
      </button>

      {mensaje && (
        <p className={`mt-2 text-sm ${tipo === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {mensaje}
        </p>
      )}
    </form>
  )
}

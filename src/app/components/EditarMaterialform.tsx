'use client'

import { useState, useEffect } from 'react'

export default function EditarMaterialForm({ editId }: { editId: number }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    stock_actual: '',
    fecha_registro: '',
  })

  const [mensaje, setMensaje] = useState('')

  // Obtener datos del material actual
  useEffect(() => {
    if (!editId) return

    fetch(`/api/materiales/${editId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          nombre: data.nombre,
          descripcion: data.descripcion ?? '',
          unidad_medida: data.unidad_medida,
          precio_unitario: data.precio_unitario.toString(),
          stock_actual: data.stock_actual.toString(),
          fecha_registro: data.fecha_registro?.slice(0, 10) ?? '',
        })
      })
      .catch(() => setMensaje('Error al cargar material'))
  }, [editId])

  // Cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Enviar actualización
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/materiales/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || 'Error al actualizar')
        return
      }

      setMensaje('Material actualizado correctamente')
    } catch (err) {
      console.error(err)
      setMensaje('Error de red')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
      <input name="unidad_medida" value={form.unidad_medida} onChange={handleChange} placeholder="Unidad" required />
      <input name="precio_unitario" type="number" step="0.01" value={form.precio_unitario} onChange={handleChange} placeholder="Precio" required />
      <input name="stock_actual" type="number" value={form.stock_actual} onChange={handleChange} placeholder="Stock" required />
      <input name="fecha_registro" type="date" value={form.fecha_registro} onChange={handleChange} required />
      <button type="submit">Actualizar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  )
}

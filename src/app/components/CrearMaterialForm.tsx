'use client'

import { useState } from 'react'

export default function CrearMaterialForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    stock_actual: '',
    fecha_registro: '',
  })

  const [mensaje, setMensaje] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/materiales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const error = await res.json()
        setMensaje(`Error: ${error.error || 'No se pudo registrar'}`)
      } else {
        setMensaje('Material registrado correctamente')
        setFormData({
          nombre: '',
          descripcion: '',
          unidad_medida: '',
          precio_unitario: '',
          stock_actual: '',
          fecha_registro: '',
        })
      }
    } catch (err) {
      setMensaje('Error en la solicitud')
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow-md">
      <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required className="border px-2 py-1 w-full" />
      <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} className="border px-2 py-1 w-full" />
      <input type="text" name="unidad_medida" placeholder="Unidad de Medida" value={formData.unidad_medida} onChange={handleChange} required className="border px-2 py-1 w-full" />
      <input type="number" name="precio_unitario" placeholder="Precio Unitario" value={formData.precio_unitario} onChange={handleChange} required className="border px-2 py-1 w-full" />
      <input type="number" name="stock_actual" placeholder="Stock Actual" value={formData.stock_actual} onChange={handleChange} required className="border px-2 py-1 w-full" />
      <input type="date" name="fecha_registro" placeholder="Fecha de Registro" value={formData.fecha_registro} onChange={handleChange} required className="border px-2 py-1 w-full" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrar</button>
      {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
    </form>
  )
}

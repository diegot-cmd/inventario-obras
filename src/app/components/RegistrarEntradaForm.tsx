'use client'

import { useState, useEffect } from 'react'

export default function RegistrarEntradaForm() {
  const [materiales, setMateriales] = useState([])
  const [form, setForm] = useState({
    id_material: '',
    cantidad: '',
    id_proveedor: '',
    fecha_entrada: '',
  })
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const fetchMateriales = async () => {
      const res = await fetch('/api/materiales')
      const data = await res.json()
      setMateriales(data)
    }

    fetchMateriales()
  }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/entradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const result = await res.json()
      if (!res.ok) {
        setMensaje(`❌ ${result.error}`)
      } else {
        setMensaje('✅ Entrada registrada correctamente')
        setForm({ id_material: '', cantidad: '', id_proveedor: '', fecha_entrada: '' })
      }
    } catch (error) {
      setMensaje('⚠️ Error al registrar entrada')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <select
        name="id_material"
        value={form.id_material}
        onChange={handleChange}
        required
        className="w-full border px-2 py-1"
      >
        <option value="">Selecciona un material</option>
        {materiales.map((mat: any) => (
          <option key={mat.id_material} value={mat.id_material}>
            {mat.nombre}
          </option>
        ))}
      </select>

      <input
        name="cantidad"
        type="number"
        value={form.cantidad}
        onChange={handleChange}
        placeholder="Cantidad"
        required
        className="w-full border px-2 py-1"
      />

      <input
        name="id_proveedor"
        type="number"
        value={form.id_proveedor}
        onChange={handleChange}
        placeholder="ID del Proveedor (opcional)"
        className="w-full border px-2 py-1"
      />

      <input
        name="fecha_entrada"
        type="date"
        value={form.fecha_entrada}
        onChange={handleChange}
        required
        className="w-full border px-2 py-1"
      />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Registrar Entrada
      </button>

      {mensaje && (
        <p className={`font-semibold ${mensaje.includes('❌') || mensaje.includes('⚠️') ? 'text-red-600' : 'text-green-600'}`}>
          {mensaje}
        </p>
      )}
    </form>
  )
}

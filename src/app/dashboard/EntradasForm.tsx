'use client'

import { useState } from 'react'

export function EntradaForm({ onSuccess }: { onSuccess: () => void }) {
  const [idMaterial, setIdMaterial] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [fecha, setFecha] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/entradas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_material: idMaterial, cantidad, fecha_entrada: fecha }),
    })
    if (res.ok) {
      alert('Entrada registrada')
      onSuccess()
      setIdMaterial('')
      setCantidad('')
      setFecha('')
    } else {
      const error = await res.json()
      alert(error.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 border p-4 rounded">
      <h2 className="font-bold mb-2">Registrar Entrada</h2>
      <input
        type="number"
        placeholder="ID Material"
        value={idMaterial}
        onChange={(e) => setIdMaterial(e.target.value)}
        className="border p-1 mr-2"
      />
      <input
        type="number"
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        className="border p-1 mr-2"
      />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="border p-1 mr-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded">Registrar</button>
    </form>
  )
}

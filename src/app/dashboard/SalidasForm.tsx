'use client'

import { useState } from 'react'

export function SalidaForm({ onSuccess }: { onSuccess: () => void }) {
  const [idMaterial, setIdMaterial] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [destino, setDestino] = useState('')
  const [fecha, setFecha] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/salidas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_material: idMaterial,
        cantidad,
        destino,
        fecha_salida: fecha,
      }),
    })
    if (res.ok) {
      alert('Salida registrada')
      onSuccess()
      setIdMaterial('')
      setCantidad('')
      setDestino('')
      setFecha('')
    } else {
      const error = await res.json()
      alert(error.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 border p-4 rounded">
      <h2 className="font-bold mb-2">Registrar Salida</h2>
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
        type="text"
        placeholder="Destino"
        value={destino}
        onChange={(e) => setDestino(e.target.value)}
        className="border p-1 mr-2"
      />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="border p-1 mr-2"
      />
      <button type="submit" className="bg-red-600 text-white px-2 py-1 rounded">Registrar</button>
    </form>
  )
}

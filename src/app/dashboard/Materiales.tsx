'use client'

import { useEffect, useState } from 'react'

export interface Material {
  id_material: number
  nombre: string
  stock_actual: number
  unidad_medida: string
  precio_unitario: number
}

export function Materiales({ refresh }: { refresh: number }) {
  const [materiales, setMateriales] = useState<Material[]>([])

  const fetchMateriales = async () => {
    const res = await fetch('/api/materiales')
    const data = await res.json()
    setMateriales(data)
  }

  useEffect(() => {
    fetchMateriales()
  }, [refresh])

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Materiales</h2>
      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Unidad</th>
            <th className="p-2 border">Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((m) => (
            <tr key={m.id_material} className="text-center">
              <td className="p-2 border">{m.nombre}</td>
              <td className="p-2 border">{m.stock_actual}</td>
              <td className="p-2 border">{m.unidad_medida}</td>
              <td className="p-2 border">{m.precio_unitario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
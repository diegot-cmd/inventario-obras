'use client'

import { useEffect, useState } from 'react'

interface Material {
  id_material: number
  nombre: string
  descripcion?: string
  unidad_medida: string
  precio_unitario: number
  stock_actual: number
  fecha_registro?: string
}

export default function ListaMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([])

  useEffect(() => {
    fetch('/api/materiales')
      .then((res) => res.json())
      .then((data) => setMateriales(data))
      .catch((err) => console.error('Error al obtener materiales:', err))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lista de Materiales</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-2 py-1">Nombre</th>
            <th className="px-2 py-1">Unidad</th>
            <th className="px-2 py-1">Precio</th>
            <th className="px-2 py-1">Stock</th>
            <th className="px-2 py-1">Fecha</th>
            <th className="px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((mat) => (
            <tr key={mat.id_material}>
              <td className="border px-2 py-1">{mat.nombre}</td>
              <td className="border px-2 py-1">{mat.unidad_medida}</td>
              <td className="border px-2 py-1">S/ {mat.precio_unitario.toFixed(2)}</td>
              <td className="border px-2 py-1">{mat.stock_actual}</td>
              <td className="border px-2 py-1">{mat.fecha_registro?.substring(0, 10)}</td>
              <td className="border px-2 py-1">
                <a href={`/materiales/editar/${mat.id_material}`} className="text-blue-600">Editar</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

interface Entrada {
  id_salida?: number // en caso compartas interfaces
  id_entrada: number
  id_material: number
  cantidad: number
  fecha_entrada: string
  materiales: {
    nombre: string
    unidad_medida: string
  }
  proveedores?: {
    nombre_empresa: string
  } | null
}

export default function ListaEntradas() {
  const [entradas, setEntradas] = useState<Entrada[]>([])

  useEffect(() => {
    fetch('/api/entradas')
      .then((res) => res.json())
      .then((data) => setEntradas(data))
      .catch((err) => console.error('Error al obtener entradas:', err))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Entradas de Material</h1>

      <div className="flex justify-between items-center mb-4">
        <a
          href="/materiales/entradas/registrar"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Registrar Entrada
        </a>
        <a href="/" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">← Volver al Inicio</a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Material</th>
              <th className="p-2 border">Cantidad</th>
              <th className="p-2 border">Unidad</th>
              <th className="p-2 border">Proveedor</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {entradas.map((entrada) => (
              <tr key={entrada.id_entrada} className="border-t">
                <td className="p-2">{entrada.id_entrada}</td>
                <td className="p-2">{entrada.materiales.nombre}</td>
                <td className="p-2">{entrada.cantidad}</td>
                <td className="p-2">{entrada.materiales.unidad_medida}</td>
                <td className="p-2">{entrada.proveedores?.nombre_empresa ?? '—'}</td>
                <td className="p-2">
                  {entrada.fecha_entrada.split('T')[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

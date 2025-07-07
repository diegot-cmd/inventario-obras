'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type SalidaConMaterial = {
  id_salida: number
  id_material: number
  cantidad: number
  destino?: string | null
  fecha_salida: string
  materiales: {
    nombre: string
  }
}

export default function ListaSalidas() {
  const router = useRouter()
  const [salidas, setSalidas] = useState<SalidaConMaterial[]>([])
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    fetch('/api/salidas')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSalidas(data)
        } else {
          setMensaje('Error al obtener salidas')
        }
      })
      .catch(() => setMensaje('Error al obtener salidas'))
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Listado de Salidas de Materiales</h1>

      {mensaje && <p className="text-red-600 mb-4">{mensaje}</p>}

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr className="text-center">
            <th className="border px-4 py-2">Material</th>
            <th className="border px-4 py-2">Cantidad</th>
            <th className="border px-4 py-2">Destino</th>
            <th className="border px-4 py-2">Fecha de salida</th>
          </tr>
        </thead>
        <tbody>
          {salidas.map((salida, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{salida.materiales?.nombre || 'Desconocido'}</td>
              <td className="border px-4 py-2">{salida.cantidad}</td>
              <td className="border px-4 py-2">{salida.destino || '-'}</td>
              <td className="border px-4 py-2">
                {new Date(salida.fecha_salida).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.back()}
          className="text-blue-600 underline hover:text-blue-800"
        >
          ← Volver
        </button>
      </div>
    </div>
  )
}

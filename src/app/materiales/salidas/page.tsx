'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalidas = async () => {
      try {
        const res = await fetch('/api/salidas')
        const data = await res.json()
        
        // Verificar si la respuesta es un array o un objeto con error
        if (Array.isArray(data)) {
          setSalidas(data)
        } else {
          console.error('Error en la API:', data)
          setSalidas([]) // Establecer array vacío si hay error
        }
      } catch (error) {
        console.error('Error al obtener salidas:', error)
        setSalidas([]) // Establecer array vacío si hay error de red
      } finally {
        setLoading(false)
      }
    }

    fetchSalidas()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/movimientos')} 
              className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Movimientos
            </button>
            <h1 className="text-2xl font-bold text-white">Salidas de Material</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-2xl">📤</span>
              Lista de Salidas
            </h2>
            <Link
              href="/materiales/salidas/registrar"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-1"
            >
              + Registrar Salida
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-gray-300 mt-4">Cargando salidas...</p>
            </div>
          ) : salidas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-300 text-lg">No hay salidas registradas</p>
              <p className="text-gray-400 mt-2">Registra tu primera salida de material</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-4 font-semibold">ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Material</th>
                    <th className="text-left py-4 px-4 font-semibold">Cantidad</th>
                    <th className="text-left py-4 px-4 font-semibold">Destino</th>
                    <th className="text-left py-4 px-4 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {salidas.map((salida) => (
                    <tr key={salida.id_salida} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-medium text-red-400">{salida.id_salida}</td>
                      <td className="py-4 px-4 font-medium">{salida.materiales?.nombre || 'Desconocido'}</td>
                      <td className="py-4 px-4 text-red-300 font-medium">{salida.cantidad}</td>
                      <td className="py-4 px-4 text-gray-300">{salida.destino || '-'}</td>
                      <td className="py-4 px-4 text-gray-300">
                        {salida.fecha_salida.split('T')[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

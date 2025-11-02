'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  const router = useRouter()
  const [entradas, setEntradas] = useState<Entrada[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const res = await fetch('/api/entradas')
        const data = await res.json()
        
        // Verificar si la respuesta es un array o un objeto con error
        if (Array.isArray(data)) {
          setEntradas(data)
        } else {
          console.error('Error en la API:', data)
          setEntradas([]) // Establecer array vacío si hay error
        }
      } catch (error) {
        console.error('Error al obtener entradas:', error)
        setEntradas([]) // Establecer array vacío si hay error de red
      } finally {
        setLoading(false)
      }
    }

    fetchEntradas()
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
            <h1 className="text-2xl font-bold text-white">Entradas de Material</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-2xl">📥</span>
              Lista de Entradas
            </h2>
            <Link
              href="/materiales/entradas/registrar"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-1"
            >
              + Registrar Entrada
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-gray-300 mt-4">Cargando entradas...</p>
            </div>
          ) : entradas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-300 text-lg">No hay entradas registradas</p>
              <p className="text-gray-400 mt-2">Registra tu primera entrada de material</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-4 font-semibold">ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Material</th>
                    <th className="text-left py-4 px-4 font-semibold">Cantidad</th>
                    <th className="text-left py-4 px-4 font-semibold">Unidad</th>
                    <th className="text-left py-4 px-4 font-semibold">Proveedor</th>
                    <th className="text-left py-4 px-4 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {entradas.map((entrada) => (
                    <tr key={entrada.id_entrada} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-medium text-green-400">{entrada.id_entrada}</td>
                      <td className="py-4 px-4 font-medium">{entrada.materiales.nombre}</td>
                      <td className="py-4 px-4 text-green-300 font-medium">{entrada.cantidad}</td>
                      <td className="py-4 px-4 text-gray-300">{entrada.materiales.unidad_medida}</td>
                      <td className="py-4 px-4 text-gray-300">{entrada.proveedores?.nombre_empresa ?? '—'}</td>
                      <td className="py-4 px-4 text-gray-300">
                        {entrada.fecha_entrada.split('T')[0]}
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

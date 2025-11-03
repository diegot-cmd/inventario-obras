'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Proveedor {
  id_proveedor: number
  nombre_empresa: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
}

export default function ProveedoresPage() {
  const router = useRouter()
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [form, setForm] = useState<Omit<Proveedor, 'id_proveedor'>>({
    nombre_empresa: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
  })
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await fetch('/api/proveedores')
        const data = await res.json()
        
        // Verificar si la respuesta es un array o un objeto con error
        if (Array.isArray(data)) {
          setProveedores(data)
        } else {
          console.error('Error en la API:', data)
          setProveedores([]) // Establecer array vacío si hay error
        }
      } catch (error) {
        console.error('Error al obtener proveedores:', error)
        setProveedores([]) // Establecer array vacío si hay error de red
      } finally {
        setLoading(false)
      }
    }

    fetchProveedores()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(editId ? `/api/proveedores/${editId}` : '/api/proveedores', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const proveedor = await res.json()
      if (editId) {
        setProveedores(prev => prev.map(p => (p.id_proveedor === editId ? proveedor : p)))
        setEditId(null)
      } else {
        setProveedores(prev => [proveedor, ...prev])
      }
      setForm({ nombre_empresa: '', contacto: '', telefono: '', email: '', direccion: '' })
    } else {
      alert('Error al guardar proveedor')
    }
  }

  const handleEdit = (p: Proveedor) => {
    setEditId(p.id_proveedor)
    setForm({
      nombre_empresa: p.nombre_empresa,
      contacto: p.contacto || '',
      telefono: p.telefono || '',
      email: p.email || '',
      direccion: p.direccion || '',
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este proveedor?')) return
    const res = await fetch(`/api/proveedores/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProveedores(prev => prev.filter(p => p.id_proveedor !== id))
    } else {
      alert('No se pudo eliminar')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/')} 
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al Inicio
            </button>
            <h1 className="text-2xl font-bold text-white">Gestión de Proveedores</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Formulario */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            {editId !== null ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium mb-2">Empresa</label>
                <input 
                  name="nombre_empresa" 
                  value={form.nombre_empresa} 
                  onChange={handleChange} 
                  placeholder="Ej: Constructora ABC S.A.C." 
                  required 
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Contacto</label>
                <input 
                  name="contacto" 
                  value={form.contacto} 
                  onChange={handleChange} 
                  placeholder="Nombre del contacto" 
                 className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
               />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Teléfono</label>
                <input 
                  name="telefono" 
                  value={form.telefono} 
                  onChange={handleChange} 
                  placeholder="Ej: +51 987 654 321" 
                 className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                 />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium mb-2">Email</label>
                <input 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="contacto@empresa.com" 
                  type="email"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Dirección</label>
                <input 
                  name="direccion" 
                  value={form.direccion} 
                  onChange={handleChange} 
                  placeholder="Dirección completa" 
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                >
                  {editId ? 'Actualizar Proveedor' : 'Registrar Proveedor'}
                </button>

                {editId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null)
                      setForm({ nombre_empresa: '', contacto: '', telefono: '', email: '', direccion: '' })
                    }}
                    className="px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Tabla de Proveedores */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="text-2xl">📋</span>
            Lista de Proveedores
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="text-gray-600 mt-4">Cargando proveedores...</p>
            </div>
          ) : proveedores.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-gray-600 text-lg">No hay proveedores registrados</p>
              <p className="text-gray-500 mt-2">Registra tu primer proveedor usando el formulario de arriba</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-black">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold">ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Empresa</th>
                    <th className="text-left py-4 px-4 font-semibold">Contacto</th>
                    <th className="text-left py-4 px-4 font-semibold">Teléfono</th>
                    <th className="text-left py-4 px-4 font-semibold">Email</th>
                    <th className="text-left py-4 px-4 font-semibold">Dirección</th>
                    <th className="text-left py-4 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.map(p => (
                    <tr key={p.id_proveedor} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-black">{p.id_proveedor}</td>
                      <td className="py-4 px-4 font-medium">{p.nombre_empresa}</td>
                      <td className="py-4 px-4 text-gray-600">{p.contacto || '-'}</td>
                      <td className="py-4 px-4 text-gray-600">{p.telefono || '-'}</td>
                      <td className="py-4 px-4 text-gray-600">{p.email || '-'}</td>
                      <td className="py-4 px-4 text-gray-600">{p.direccion || '-'}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(p.id_proveedor)}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
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

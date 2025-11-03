'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegistrarEntrada() {
  const router = useRouter()
  const [form, setForm] = useState({
    id_material: '',
    cantidad: '',
    fecha_entrada: '',
    id_proveedor: '',
  })
  const [materiales, setMateriales] = useState<{ id_material: number; nombre: string }[]>([])
  const [proveedores, setProveedores] = useState<{ id_proveedor: number; nombre_empresa: string }[]>([])
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<'success'|'error'|''>('')

  useEffect(() => {
    fetch('/api/materiales').then(r=>r.json()).then(setMateriales).catch(()=>{})
    fetch('/api/proveedores').then(r=>r.json()).then(setProveedores).catch(()=>{})
  },[])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    setForm({...form, [e.target.name]: e.target.value})
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/entradas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    const data = await res.json()
    if (!res.ok) {
      setTipoMensaje('error'); setMensaje(data.error||'Error')
    } else {
      setTipoMensaje('success'); setMensaje('Entrada registrada')
      setForm({id_material:'',cantidad:'',fecha_entrada:'',id_proveedor:''})
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/movimientos')} 
              className="flex items-center gap-2 text-black hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Movimientos
            </button>
            <h1 className="text-2xl font-bold text-black">Registrar Entrada de Material</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <span className="text-2xl">📥</span>
              Nueva Entrada de Material
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-black font-medium mb-2">Material</label>
                <select 
                  name="id_material" 
                  value={form.id_material} 
                  onChange={handleChange} 
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                  required
                >
                  <option value="">Seleccione un material</option>
                  {materiales.map(mat=>(
                    <option key={mat.id_material} value={mat.id_material}>{mat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Cantidad</label>
                <input 
                  type="number" 
                  name="cantidad" 
                  value={form.cantidad} 
                  onChange={handleChange}
                  placeholder="Ej: 100" 
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                  required
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Fecha de Entrada</label>
                <input 
                  type="date" 
                  name="fecha_entrada" 
                  value={form.fecha_entrada} 
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                  required
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Proveedor (Opcional)</label>
                <select 
                  name="id_proveedor" 
                  value={form.id_proveedor} 
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Seleccione un proveedor (opcional)</option>
                  {proveedores.map(p=>(
                    <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_empresa}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-black hover:bg-gray-800 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                >
                  Registrar Entrada
                </button>
                <Link 
                  href="/movimientos" 
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 text-center"
                >
                  ← Volver
                </Link>
              </div>

              {mensaje && (
                <div className={`p-4 rounded-xl ${tipoMensaje === 'success' ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'}`}>
                  {mensaje}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

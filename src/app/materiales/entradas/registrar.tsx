'use client'

import { useEffect, useState } from 'react'
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
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error' | ''>('')

  useEffect(() => {
    // Obtener materiales
    fetch('/api/materiales')
      .then((res) => res.json())
      .then((data) => setMateriales(data))
      .catch(() => setMensaje('Error al cargar materiales'))

    // Obtener proveedores
    fetch('/api/proveedores')
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch(() => setMensaje('Error al cargar proveedores'))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/entradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || 'Error al registrar entrada')
        setTipoMensaje('error')
      } else {
        setMensaje('Entrada registrada correctamente')
        setTipoMensaje('success')
        setForm({ id_material: '', cantidad: '', fecha_entrada: '', id_proveedor: '' })
      }
    } catch (err) {
      console.error(err)
      setMensaje('Error al registrar entrada')
      setTipoMensaje('error')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Entrada de Material</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="id_material"
          value={form.id_material}
          onChange={handleChange}
          required
          className="border w-full p-2 rounded"
        >
          <option value="">Seleccione un material</option>
          {materiales.map((mat) => (
            <option key={mat.id_material} value={mat.id_material}>
              {mat.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          onChange={handleChange}
          placeholder="Cantidad"
          required
          className="border w-full p-2 rounded"
        />

        <select
          name="id_proveedor"
          value={form.id_proveedor}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        >
          <option value="">Seleccione un proveedor (opcional)</option>
          {proveedores.map((prov) => (
            <option key={prov.id_proveedor} value={prov.id_proveedor}>
              {prov.nombre_empresa}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha_entrada"
          value={form.fecha_entrada}
          onChange={handleChange}
          required
          className="border w-full p-2 rounded"
        />

        <div className="flex justify-between mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Registrar Entrada
          </button>
          <a href="/materiales/entradas" className="text-blue-600 hover:underline">
            ← Volver al Listado
          </a>
        </div>

        {mensaje && (
          <p className={`mt-2 text-sm ${tipoMensaje === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </form>
    </div>
  )
}

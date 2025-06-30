'use client'

import { useEffect, useState } from 'react'

interface Material {
  id_material: number
  nombre: string
}

interface Proveedor {
  id_proveedor: number
  nombre_empresa: string
}

export default function RegistrarEntrada() {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [form, setForm] = useState({
    id_material: '',
    cantidad: '',
    id_proveedor: '',
    fecha_entrada: '',
  })
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const res = await fetch('/api/materiales')
        const data = await res.json()
        setMateriales(data)
      } catch (err) {
        console.error('Error al cargar materiales:', err)
      }
    }

    const fetchProveedores = async () => {
      try {
        const res = await fetch('/api/proveedores')
        const data = await res.json()
        setProveedores(data)
      } catch (err) {
        console.error('Error al cargar proveedores:', err)
      }
    }

    fetchMateriales()
    fetchProveedores()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
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

      const json = await res.json()

      if (!res.ok) {
        setMensaje(`❌ ${json.error || 'Error al registrar entrada'}`)
      } else {
        setMensaje('✅ Entrada registrada correctamente')
        setForm({ id_material: '', cantidad: '', id_proveedor: '', fecha_entrada: '' })
      }
    } catch (err) {
      console.error(err)
      setMensaje('❌ Error al enviar los datos')
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Entrada de Material</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border rounded p-4 shadow-md">
        <select name="id_material" value={form.id_material} onChange={handleChange} required className="border w-full p-2 rounded">
          <option value="">Seleccionar Material</option>
          {materiales.map((mat) => (
            <option key={mat.id_material} value={mat.id_material}>
              {mat.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={handleChange}
          required
          className="border w-full p-2 rounded"
        />

        <select name="id_proveedor" value={form.id_proveedor} onChange={handleChange} className="border w-full p-2 rounded">
          <option value="">Seleccionar Proveedor (opcional)</option>
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

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Registrar Entrada
        </button>

        {mensaje && (
          <p className={`mt-2 text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{mensaje}</p>
        )}
      </form>
    </main>
  )
}

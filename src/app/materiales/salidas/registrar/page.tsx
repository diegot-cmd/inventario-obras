// app/materiales/salidas/registrar/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistrarSalida() {
  const router = useRouter()
  const [form, setForm] = useState({
    id_material: '',
    cantidad: '',
    destino: '',
    fecha_salida: '',
  })
  const [materiales, setMateriales] = useState<{ id_material: number; nombre: string }[]>([])
  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState<'success'|'error'>('success')

  useEffect(() => {
    fetch('/api/materiales')
      .then(r => r.json())
      .then(setMateriales)
      .catch(() => { setMensaje('Error al cargar materiales'); setTipo('error') })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/salidas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setMensaje(data.error || 'No se pudo registrar')
      setTipo('error')
    } else {
      setMensaje('Salida registrada')
      setTipo('success')
      setForm({ id_material: '', cantidad: '', destino: '', fecha_salida: '' })
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Salida</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="id_material"
          value={form.id_material}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Selecciona material</option>
          {materiales.map(m => (
            <option key={m.id_material} value={m.id_material}>
              {m.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          placeholder="Cantidad"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="destino"
          value={form.destino}
          placeholder="Destino"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="fecha_salida"
          value={form.fecha_salida}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Registrar
          </button>
          <a
            href="/materiales/salidas"
            className="text-blue-600 hover:underline"
          >
            ← Volver al listado
          </a>
        </div>

        {mensaje && (
          <p className={`mt-2 text-sm ${tipo === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </form>
    </div>
  )
}

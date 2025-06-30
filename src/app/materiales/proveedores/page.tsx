'use client'

import { useEffect, useState } from 'react'

interface Proveedor {
  id_proveedor: number
  nombre_empresa: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [form, setForm] = useState<Omit<Proveedor, 'id_proveedor'>>({
    nombre_empresa: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
  })
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/proveedores')
      .then(res => res.json())
      .then(data => setProveedores(data))
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Proveedores</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input name="nombre_empresa" value={form.nombre_empresa} onChange={handleChange} placeholder="Empresa" required className="border p-2 rounded" />
        <input name="contacto" value={form.contacto} onChange={handleChange} placeholder="Contacto" className="border p-2 rounded" />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="border p-2 rounded" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Correo" className="border p-2 rounded" />
        <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="border p-2 rounded" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {editId ? 'Actualizar' : 'Registrar'}
        </button>
      </form>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Empresa</th>
            <th className="p-2 border">Contacto</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Dirección</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(p => (
            <tr key={p.id_proveedor} className="hover:bg-gray-50 border-t">
              <td className="p-2 border">{p.id_proveedor}</td>
              <td className="p-2 border">{p.nombre_empresa}</td>
              <td className="p-2 border">{p.contacto}</td>
              <td className="p-2 border">{p.telefono}</td>
              <td className="p-2 border">{p.email}</td>
              <td className="p-2 border">{p.direccion}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline">Editar</button>
                <button onClick={() => handleDelete(p.id_proveedor)} className="text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <a href="/" className="text-blue-600 underline">← Volver al Inicio</a>
      </div>
    </div>
  )
}

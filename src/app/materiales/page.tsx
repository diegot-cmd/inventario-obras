'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
interface Material {
  id_material: number;
  nombre: string;
  descripcion?: string | null;
  unidad_medida: string;
  precio_unitario: number | null;
  stock_actual: number | null;
  fecha_registro: string | null;
}

export default function MaterialesPage() {
    const router = useRouter()
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    stock_actual: '',
    fecha_registro: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      precio_unitario: parseFloat(form.precio_unitario),
      stock_actual: parseInt(form.stock_actual),
      fecha_registro: form.fecha_registro
    };

    try {
      let res;
      if (editId !== null) {
        res = await fetch(`/api/materiales/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/materiales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (editId !== null) {
          setMateriales(materiales.map((m) => m.id_material === editId ? data : m));
          setMensaje('✅ Material actualizado correctamente.');
        } else {
          setMateriales([data, ...materiales]);
          setMensaje('✅ Material registrado correctamente.');
        }
        setEditId(null);
        setForm({ nombre: '', descripcion: '', unidad_medida: '', precio_unitario: '', stock_actual: '', fecha_registro: '' });
      } else {
        setMensaje('❌ Error al guardar material.');
      }
    } catch (error) {
      console.error('Error al guardar material:', error);
      setMensaje('⚠️ Ocurrió un error al guardar.');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmar = confirm('¿Estás seguro que deseas eliminar este material?');
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/materiales/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMateriales(materiales.filter((m) => m.id_material !== id));
        setMensaje('✅ Material eliminado correctamente.');
      } else {
        setMensaje('❌ No se pudo eliminar el material.');
      }
    } catch (error) {
      console.error('Error al eliminar material:', error);
      setMensaje('⚠️ Ocurrió un error al intentar eliminar.');
    }
  };

  const handleEdit = (mat: Material) => {
    setEditId(mat.id_material);
    setForm({
      nombre: mat.nombre,
      descripcion: mat.descripcion || '',
      unidad_medida: mat.unidad_medida || '',
      precio_unitario: (mat.precio_unitario ?? 0).toString(),
      stock_actual: mat.stock_actual?.toString() || '0',
      fecha_registro: mat.fecha_registro
        ? new Date(mat.fecha_registro).toISOString().split('T')[0]
        : '',
    });
  };

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const res = await fetch('/api/materiales');
        const data = await res.json();
        setMateriales(data);
      } catch (error) {
        console.error('Error al obtener materiales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, []);

  return (
    <main className="p-6"><button onClick={() => router.push('/')} className="mb-4 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
  ← Volver al Inicio
</button>
      <h1 className="text-2xl font-bold mb-4">Inventario de Materiales</h1>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="border p-2 rounded" />
        <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded" />
        <input name="unidad_medida" value={form.unidad_medida} onChange={handleChange} placeholder="Unidad de Medida" required className="border p-2 rounded" />
        <input name="precio_unitario" value={form.precio_unitario} onChange={handleChange} placeholder="Precio Unitario" required className="border p-2 rounded" type="number" step="0.01" />
        <input name="stock_actual" value={form.stock_actual} onChange={handleChange} placeholder="Stock" required className="border p-2 rounded" type="number" />
        <input name="fecha_registro" value={form.fecha_registro} onChange={handleChange} placeholder="Fecha" required className="border p-2 rounded" type="date" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {editId !== null ? 'Actualizar Material' : 'Registrar Material'}
        </button>
        {editId !== null && (
          <button type="button" onClick={() => {
            setEditId(null);
            setForm({ nombre: '', descripcion: '', unidad_medida: '', precio_unitario: '', stock_actual: '', fecha_registro: '' });
          }} className="col-span-2 text-sm text-gray-500 underline">
            ← Cancelar edición
          </button>
        )}
        {mensaje && (
          <p className={`col-span-2 text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </form>

      {loading ? (
        <p className="text-gray-600">Cargando materiales...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Nombre</th>
                <th className="p-3 border-b">Descripción</th>
                <th className="p-3 border-b">Unidad</th>
                <th className="p-3 border-b">Precio Unitario</th>
                <th className="p-3 border-b">Stock</th>
                <th className="p-3 border-b">Fecha</th>
                <th className="p-3 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materiales.map((mat) => (
                <tr key={mat.id_material} className="border-t hover:bg-gray-50">
                  <td className="p-3">{mat.id_material}</td>
                  <td className="p-3">{mat.nombre}</td>
                  <td className="p-3">{mat.descripcion || '-'}</td>
                  <td className="p-3">{mat.unidad_medida || '-'}</td>
                  <td className="p-3">S/. {mat.precio_unitario !== null ? parseFloat(mat.precio_unitario.toString()).toFixed(2) : '0.00'}</td>
                  <td className="p-3">{mat.stock_actual ?? 0}</td>
                 <td className="p-3">
  {mat.fecha_registro
    ? mat.fecha_registro.split('T')[0] // Formatear fecha a YYYY-MM-DD
    : 'Sin fecha'}
</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(mat)} className="text-blue-600 hover:underline">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(mat.id_material)} className="text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

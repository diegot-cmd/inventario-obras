"use client";

import React, { useEffect, useState } from 'react';

interface Material {
  id_material: number;
  nombre: string;
  descripcion: string | null;
  unidad_medida: string;
  precio_unitario: string;
  stock_actual: number;
  fecha_registro: string;
}

export default function MaterialesPage() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    precio_unitario: '',
    stock_actual: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      precio_unitario: parseFloat(form.precio_unitario),
      stock_actual: parseInt(form.stock_actual)
    };

    try {
      if (editId !== null) {
        const res = await fetch(`/api/materiales/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const actualizado = await res.json();
          setMateriales(materiales.map((m) => m.id_material === editId ? actualizado : m));
          setEditId(null);
        }
      } else {
        const res = await fetch('/api/materiales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const nuevo = await res.json();
          setMateriales([nuevo, ...materiales]);
        }
      }
      setForm({ nombre: '', descripcion: '', unidad_medida: '', precio_unitario: '', stock_actual: '' });
    } catch (error) {
      console.error('Error al guardar material:', error);
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
      alert('✅ Material eliminado correctamente.');
    } else {
      alert('❌ No se pudo eliminar el material.');
    }
  } catch (error) {
    console.error('Error al eliminar material:', error);
    alert('⚠️ Ocurrió un error al intentar eliminar.');
  }
};

  const handleEdit = (mat: Material) => {
    setEditId(mat.id_material);
    setForm({
      nombre: mat.nombre,
      descripcion: mat.descripcion || '',
      unidad_medida: mat.unidad_medida,
      precio_unitario: mat.precio_unitario,
      stock_actual: mat.stock_actual.toString()
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
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventario de Materiales</h1>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="border p-2 rounded" />
        <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded" />
        <input name="unidad_medida" value={form.unidad_medida} onChange={handleChange} placeholder="Unidad de Medida" required className="border p-2 rounded" />
        <input name="precio_unitario" value={form.precio_unitario} onChange={handleChange} placeholder="Precio Unitario" required className="border p-2 rounded" type="number" step="0.01" />
        <input name="stock_actual" value={form.stock_actual} onChange={handleChange} placeholder="Stock" required className="border p-2 rounded" type="number" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {editId !== null ? 'Actualizar Material' : 'Registrar Material'}
        </button>
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
                  <td className="p-3">{mat.descripcion}</td>
                  <td className="p-3">{mat.unidad_medida}</td>
                  <td className="p-3">S/. {parseFloat(mat.precio_unitario).toFixed(2)}</td>
                  <td className="p-3">{mat.stock_actual}</td>
                  <td className="p-3">{new Date(mat.fecha_registro).toLocaleDateString()}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(mat)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(mat.id_material)}
                      className="text-red-600 hover:underline"
                    >
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

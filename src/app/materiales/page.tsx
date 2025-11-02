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
      
      // Verificar si la respuesta es un array o un objeto con error
      if (Array.isArray(data)) {
        setMateriales(data);
      } else {
        console.error('Error en la API:', data);
        setMateriales([]); // Establecer array vacío si hay error
      }
    } catch (error) {
      console.error('Error al obtener materiales:', error);
      setMateriales([]); // Establecer array vacío si hay error de red
    } finally {
      setLoading(false);
    }
  };

    fetchMateriales();
  }, []);

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
            <h1 className="text-2xl font-bold text-white">Gestión de Materiales</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Formulario */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="text-2xl">📦</span>
            {editId !== null ? 'Editar Material' : 'Registrar Nuevo Material'}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium mb-2">Nombre del Material</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Cemento Portland"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Descripción</label>
                <input
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción opcional"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Unidad de Medida</label>
                <input
                  name="unidad_medida"
                  value={form.unidad_medida}
                  onChange={handleChange}
                  placeholder="Ej: Kilogramo, Metro, Litro"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium mb-2">Precio Unitario (S/.)</label>
                <input
                  name="precio_unitario"
                  value={form.precio_unitario}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  type="number"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Stock Inicial</label>
                <input
                  name="stock_actual"
                  value={form.stock_actual}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  type="number"
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">Fecha de Registro</label>
                <input
                  name="fecha_registro"
                  value={form.fecha_registro}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  type="date"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button 
                type="submit" 
                className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                {editId !== null ? 'Actualizar Material' : 'Registrar Material'}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({ nombre: '', descripcion: '', unidad_medida: '', precio_unitario: '', stock_actual: '', fecha_registro: '' });
                  }}
                  className="px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Cancelar
                </button>
              )}
            </div>

            {mensaje && (
              <div className={`md:col-span-2 p-4 rounded-xl ${mensaje.startsWith('✅') ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'}`}>
                {mensaje}
              </div>
            )}
          </form>
        </div>

        {/* Tabla de Materiales */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="text-2xl">📋</span>
            Inventario de Materiales
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="text-gray-600 mt-4">Cargando materiales...</p>
            </div>
          ) : materiales.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg">No hay materiales registrados</p>
              <p className="text-gray-500 mt-2">Registra tu primer material usando el formulario de arriba</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-black">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold">Material</th>
                    <th className="text-left py-4 px-4 font-semibold">Descripción</th>
                    <th className="text-left py-4 px-4 font-semibold">Unidad</th>
                    <th className="text-left py-4 px-4 font-semibold">Precio</th>
                    <th className="text-left py-4 px-4 font-semibold">Stock</th>
                    <th className="text-left py-4 px-4 font-semibold">Fecha</th>
                    <th className="text-left py-4 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {materiales.map((mat) => (
                    <tr key={mat.id_material} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium">{mat.nombre}</td>
                      <td className="py-4 px-4 text-gray-600">{mat.descripcion || '-'}</td>
                      <td className="py-4 px-4">{mat.unidad_medida}</td>
                      <td className="py-4 px-4 text-black font-medium">
                        S/. {mat.precio_unitario !== null ? parseFloat(mat.precio_unitario.toString()).toFixed(2) : '0.00'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (mat.stock_actual ?? 0) > 10
                            ? 'bg-gray-100 text-gray-800'
                            : (mat.stock_actual ?? 0) > 0
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-gray-300 text-gray-800'
                        }`}>
                          {mat.stock_actual ?? 0}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {mat.fecha_registro ? mat.fecha_registro.split('T')[0] : 'Sin fecha'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(mat)}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(mat.id_material)}
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
  );
}

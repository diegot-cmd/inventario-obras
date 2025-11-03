'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Entrada {
  id_entrada: number;
  cantidad: number;
  fecha_entrada: string;
  materiales: {
    nombre: string;
  };
  proveedores?: {
    nombre_empresa: string;
  };
}

interface Salida {
  id_salida: number;
  cantidad: number;
  fecha_salida: string;
  destino?: string;
  materiales: {
    nombre: string;
  };
}

export default function MovimientosPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'entradas' | 'salidas' | 'registrar-entrada' | 'registrar-salida'>('entradas');
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [loading, setLoading] = useState(true);
  const [materiales, setMateriales] = useState<{ id_material: number; nombre: string }[]>([]);
  const [proveedores, setProveedores] = useState<{ id_proveedor: number; nombre_empresa: string }[]>([]);

  const [entradaForm, setEntradaForm] = useState({ id_material: '', cantidad: '', fecha_entrada: '', id_proveedor: '' });
  const [entradaMensaje, setEntradaMensaje] = useState('');
  const [entradaTipo, setEntradaTipo] = useState<'success' | 'error' | ''>('');

  const [salidaForm, setSalidaForm] = useState({ id_material: '', cantidad: '', destino: '', fecha_salida: '' });
  const [salidaMensaje, setSalidaMensaje] = useState('');
  const [salidaTipo, setSalidaTipo] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchEntradas();
    fetchSalidas();
    // fetch materials and providers used by the inline forms
    fetch('/api/materiales')
      .then((r) => r.json())
      .then(setMateriales)
      .catch(() => setMateriales([]));

    fetch('/api/proveedores')
      .then((r) => r.json())
      .then(setProveedores)
      .catch(() => setProveedores([]));
  }, []);

  const fetchEntradas = async () => {
    try {
      const res = await fetch('/api/entradas');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setEntradas(data);
      } else {
        console.error('Error en la API de entradas:', data);
        setEntradas([]);
      }
    } catch (error) {
      console.error('Error al obtener entradas:', error);
      setEntradas([]);
    }
  };

  const fetchSalidas = async () => {
    try {
      const res = await fetch('/api/salidas');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setSalidas(data);
      } else {
        console.error('Error en la API de salidas:', data);
        setSalidas([]);
      }
    } catch (error) {
      console.error('Error al obtener salidas:', error);
      setSalidas([]);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Registrar Entrada (inline)
  const handleEntradaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEntradaForm({ ...entradaForm, [e.target.name]: e.target.value });

  const handleEntradaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/entradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entradaForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setEntradaTipo('error');
        setEntradaMensaje(data.error || 'No se pudo registrar la entrada');
      } else {
        setEntradaTipo('success');
        setEntradaMensaje('Entrada registrada');
        setEntradaForm({ id_material: '', cantidad: '', fecha_entrada: '', id_proveedor: '' });
        fetchEntradas();
      }
    } catch (err) {
      setEntradaTipo('error');
      setEntradaMensaje('Error de red al registrar');
    }
  };

  // Handlers for Registrar Salida (inline)
  const handleSalidaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setSalidaForm({ ...salidaForm, [e.target.name]: e.target.value });

  const handleSalidaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/salidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salidaForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setSalidaTipo('error');
        setSalidaMensaje(data.error || 'No se pudo registrar la salida');
      } else {
        setSalidaTipo('success');
        setSalidaMensaje('Salida registrada');
        setSalidaForm({ id_material: '', cantidad: '', destino: '', fecha_salida: '' });
        fetchSalidas();
      }
    } catch (err) {
      setSalidaTipo('error');
      setSalidaMensaje('Error de red al registrar');
    }
  };

  const tabs = [
    { id: 'entradas', label: 'Ver Entradas', icon: '📥' },
    { id: 'salidas', label: 'Ver Salidas', icon: '📤' },
    { id: 'registrar-entrada', label: 'Registrar Entrada', icon: '➕' },
    { id: 'registrar-salida', label: 'Registrar Salida', icon: '➖' }
  ];

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
            <h1 className="text-2xl font-bold text-white">Gestión de Movimientos</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-2 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-lg'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
  <div className="bg-white border border-gray-200 rounded-2xl p-8">
          
          {/* Ver Entradas */}
          {activeTab === 'entradas' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">📥</span>
                Entradas de Materiales
              </h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  <p className="text-gray-600 mt-4">Cargando entradas...</p>
                </div>
              ) : entradas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-600 text-lg">No hay entradas registradas</p>
                  <p className="text-gray-500 mt-2">Registra tu primera entrada de materiales</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-black">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-2">Material</th>
                        <th className="text-left py-4 px-2">Cantidad</th>
                        <th className="text-left py-4 px-2">Proveedor</th>
                        <th className="text-left py-4 px-2">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entradas.map((entrada) => (
                        <tr key={entrada.id_entrada} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-2 font-medium">{entrada.materiales.nombre}</td>
                          <td className="py-4 px-2">{entrada.cantidad}</td>
                          <td className="py-4 px-2">{entrada.proveedores?.nombre_empresa || 'Sin proveedor'}</td>
                          <td className="py-4 px-2">{entrada.fecha_entrada?.split('T')[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Ver Salidas */}
          {activeTab === 'salidas' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">📤</span>
                Salidas de Materiales
              </h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-gray-300 mt-4">Cargando salidas...</p>
                </div>
              ) : salidas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-300 text-lg">No hay salidas registradas</p>
                  <p className="text-gray-400 mt-2">Registra tu primera salida de materiales</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 px-2">Material</th>
                        <th className="text-left py-4 px-2">Cantidad</th>
                        <th className="text-left py-4 px-2">Destino</th>
                        <th className="text-left py-4 px-2">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salidas.map((salida) => (
                        <tr key={salida.id_salida} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-2 font-medium">{salida.materiales.nombre}</td>
                          <td className="py-4 px-2">{salida.cantidad}</td>
                          <td className="py-4 px-2">{salida.destino || 'Sin destino'}</td>
                          <td className="py-4 px-2">{salida.fecha_salida?.split('T')[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Registrar Entrada (inline) */}
          {activeTab === 'registrar-entrada' && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <span className="text-2xl">📥</span>
                Nueva Entrada de Material
              </h2>

              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <form onSubmit={handleEntradaSubmit} className="space-y-6">
                    <div>
                      <label className="block text-black font-medium mb-2">Material</label>
                      <select
                        name="id_material"
                        value={entradaForm.id_material}
                        onChange={handleEntradaChange}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" required
                      >
                        <option value="">Seleccione un material</option>
                        {materiales.map((mat) => (
                          <option key={mat.id_material} value={mat.id_material}>
                            {mat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-black font-medium mb-2">Cantidad</label>
                      <input
                        type="number"
                        name="cantidad"
                        value={entradaForm.cantidad}
                        onChange={handleEntradaChange}
                        placeholder="Ej: 100"
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"  required
                      />
                    </div>

                    <div>
                      <label className="block text-black font-medium mb-2">Fecha de Entrada</label>
                      <input
                        type="date"
                        name="fecha_entrada"
                        value={entradaForm.fecha_entrada}
                        onChange={handleEntradaChange}
                       className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"  required
                      />
                    </div>

                    <div>
                      <label className="block text-black font-medium mb-2">Proveedor (Opcional)</label>
                      <select
                        name="id_proveedor"
                        value={entradaForm.id_proveedor}
                        onChange={handleEntradaChange}
                       className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"   >
                        <option value="">Seleccione un proveedor (opcional)</option>
                        {proveedores.map((p) => (
                          <option key={p.id_proveedor} value={p.id_proveedor}>
                            {p.nombre_empresa}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-1"
                      >
                        Registrar Entrada
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('entradas')}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 transform hover:-translate-y-1"
                      >
                        ← Volver
                      </button>
                    </div>

                    {entradaMensaje && (
                      <div
                        className={`p-4 rounded-xl ${
                          entradaTipo === 'success'
                            ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                            : 'bg-red-500/20 border border-red-500/30 text-red-300'
                        }`}
                      >
                        {entradaMensaje}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Registrar Salida (inline) */}
          {activeTab === 'registrar-salida' && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <span className="text-2xl">📤</span>
                Nueva Salida de Material
              </h2>

              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <form onSubmit={handleSalidaSubmit} className="space-y-6">
                    <div>
                      <label className="block text-black font-medium mb-2">Material</label>
                      <select
                        name="id_material"
                        value={salidaForm.id_material}
                        onChange={handleSalidaChange}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                    required
                      >
                        <option value="">Selecciona material</option>
                        {materiales.map((m) => (
                          <option key={m.id_material} value={m.id_material}>
                            {m.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-black font-medium mb-2">Cantidad</label>
                      <input
                        type="number"
                        name="cantidad"
                        value={salidaForm.cantidad}
                        placeholder="Ej: 50"
                        onChange={handleSalidaChange}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                    required
                      />
                    </div>

                    <div>
                      <label className="block text-black font-medium mb-2">Destino</label>
                      <input
                        type="text"
                        name="destino"
                        value={salidaForm.destino}
                        placeholder="Ej: Obra Norte, Almacén Central"
                        onChange={handleSalidaChange}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                    />
                    </div>

                    <div>
                      <label className="block text-black font-medium mb-2">Fecha de Salida</label>
                      <input
                        type="date"
                        name="fecha_salida"
                        value={salidaForm.fecha_salida}
                        onChange={handleSalidaChange}
                       className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                    required
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-1"
                      >
                        Registrar Salida
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('salidas')}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 transform hover:-translate-y-1"
                      >
                        ← Volver
                      </button>
                    </div>

                    {salidaMensaje && (
                      <div className={`p-4 rounded-xl ${salidaTipo === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-300' : 'bg-red-500/20 border border-red-500/30 text-red-300'}`}>
                        {salidaMensaje}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

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

  useEffect(() => {
    fetchEntradas();
    fetchSalidas();
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

  const tabs = [
    { id: 'entradas', label: 'Ver Entradas', icon: '📥' },
    { id: 'salidas', label: 'Ver Salidas', icon: '📤' },
    { id: 'registrar-entrada', label: 'Registrar Entrada', icon: '➕' },
    { id: 'registrar-salida', label: 'Registrar Salida', icon: '➖' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/')} 
              className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
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
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 mb-8 border border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          
          {/* Ver Entradas */}
          {activeTab === 'entradas' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">📥</span>
                Entradas de Materiales
              </h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-gray-300 mt-4">Cargando entradas...</p>
                </div>
              ) : entradas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-300 text-lg">No hay entradas registradas</p>
                  <p className="text-gray-400 mt-2">Registra tu primera entrada de materiales</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 px-2">Material</th>
                        <th className="text-left py-4 px-2">Cantidad</th>
                        <th className="text-left py-4 px-2">Proveedor</th>
                        <th className="text-left py-4 px-2">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entradas.map((entrada) => (
                        <tr key={entrada.id_entrada} className="border-b border-white/10 hover:bg-white/5 transition-colors">
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

          {/* Registrar Entrada */}
          {activeTab === 'registrar-entrada' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">➕</span>
                Registrar Nueva Entrada
              </h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <p className="text-gray-300 text-lg mb-4">Formulario de entrada en desarrollo</p>
                <Link href="/materiales/entradas/registrar">
                  <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25">
                    Ir al formulario actual
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Registrar Salida */}
          {activeTab === 'registrar-salida' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">➖</span>
                Registrar Nueva Salida
              </h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <p className="text-gray-300 text-lg mb-4">Formulario de salida en desarrollo</p>
                <Link href="/materiales/salidas/registrar">
                  <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25">
                    Ir al formulario actual
                  </button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

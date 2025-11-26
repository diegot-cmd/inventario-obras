'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface Reportes {
  estadisticas_generales: {
    total_materiales: number;
    total_entradas: number;
    total_salidas: number;
    total_proveedores: number;
    valor_total_inventario: string;
  };
  stock_bajo: Array<{
    id_material: number;
    nombre: string;
    stock_actual: number;
    unidad_medida: string;
  }>;
  materiales_mas_utilizados: Array<{
    id_material: number;
    nombre: string;
    unidad_medida: string;
    cantidad_salidas: number;
  }>;
  proveedores_frecuentes: Array<{
    id_proveedor: number;
    nombre_empresa: string;
    contacto: string;
    cantidad_entradas: number;
  }>;
  movimientos_recientes: {
    entradas: Array<{
      id_entrada: number;
      cantidad: number;
      fecha_entrada: string;
      materiales: { nombre: string };
      proveedores: { nombre_empresa: string } | null;
    }>;
    salidas: Array<{
      id_salida: number;
      cantidad: number;
      fecha_salida: string;
      destino: string | null;
      materiales: { nombre: string };
    }>;
  };
  top_materiales_por_valor: Array<{
    id_material: number;
    nombre: string;
    stock_actual: number;
    precio_unitario: number;
    unidad_medida: string;
    valor_total: number;
  }>;
}

export default function ReportesPage() {
  const router = useRouter();
  const [reportes, setReportes] = useState<Reportes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportes();
  }, []);

  const fetchReportes = async () => {
    try {
      const res = await fetch('/api/reportes');
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al cargar reportes');
        return;
      }

      const data = await res.json();
      setReportes(data);
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const descargarExcel = () => {
    if (!reportes) {
      alert('No hay datos para exportar');
      return;
    }

    try {
      console.log('Iniciando descarga de Excel...');
      const wb = XLSX.utils.book_new();

      // Hoja 1: Estadísticas Generales
      const estadisticas = [
      ['Concepto', 'Valor'],
      ['Total Materiales', reportes.estadisticas_generales.total_materiales],
      ['Total Entradas', reportes.estadisticas_generales.total_entradas],
      ['Total Salidas', reportes.estadisticas_generales.total_salidas],
      ['Total Proveedores', reportes.estadisticas_generales.total_proveedores],
        ['Valor Total Inventario', `S/. ${parseFloat(reportes.estadisticas_generales.valor_total_inventario).toFixed(2)}`],
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(estadisticas);
      XLSX.utils.book_append_sheet(wb, ws1, 'Estadísticas Generales');

      // Hoja 2: Stock Bajo
      if (reportes.stock_bajo.length > 0) {
        const stockBajo = [
          ['ID Material', 'Nombre', 'Stock Actual', 'Unidad Medida'],
          ...reportes.stock_bajo.map(m => [m.id_material, m.nombre, m.stock_actual, m.unidad_medida])
        ];
        const ws2 = XLSX.utils.aoa_to_sheet(stockBajo);
        XLSX.utils.book_append_sheet(wb, ws2, 'Stock Bajo');
      }

      // Hoja 3: Materiales Más Utilizados
      if (reportes.materiales_mas_utilizados.length > 0) {
        const masUtilizados = [
          ['ID Material', 'Nombre', 'Unidad Medida', 'Cantidad Salidas'],
          ...reportes.materiales_mas_utilizados.map(m => [m.id_material, m.nombre, m.unidad_medida, m.cantidad_salidas])
        ];
        const ws3 = XLSX.utils.aoa_to_sheet(masUtilizados);
        XLSX.utils.book_append_sheet(wb, ws3, 'Más Utilizados');
      }

      // Hoja 4: Proveedores Frecuentes
      if (reportes.proveedores_frecuentes.length > 0) {
        const proveedores = [
          ['ID Proveedor', 'Nombre Empresa', 'Contacto', 'Cantidad Entradas'],
          ...reportes.proveedores_frecuentes.map(p => [p.id_proveedor, p.nombre_empresa, p.contacto || 'Sin contacto', p.cantidad_entradas])
        ];
        const ws4 = XLSX.utils.aoa_to_sheet(proveedores);
        XLSX.utils.book_append_sheet(wb, ws4, 'Proveedores Frecuentes');
      }

      // Hoja 5: Top Materiales por Valor
      if (reportes.top_materiales_por_valor.length > 0) {
        const topValor = [
          ['ID Material', 'Nombre', 'Stock Actual', 'Precio Unitario', 'Unidad Medida', 'Valor Total'],
          ...reportes.top_materiales_por_valor.map(m => [
            m.id_material,
            m.nombre,
            m.stock_actual,
            `S/. ${Number(m.precio_unitario).toFixed(2)}`,
            m.unidad_medida,
            `S/. ${Number(m.valor_total).toFixed(2)}`
          ])
        ];
        const ws5 = XLSX.utils.aoa_to_sheet(topValor);
        XLSX.utils.book_append_sheet(wb, ws5, 'Top por Valor');
      }

      // Hoja 6: Últimas Entradas
      if (reportes.movimientos_recientes.entradas.length > 0) {
        const entradas = [
          ['ID Entrada', 'Material', 'Proveedor', 'Cantidad', 'Fecha'],
          ...reportes.movimientos_recientes.entradas.map(e => [
            e.id_entrada,
            e.materiales.nombre,
            e.proveedores?.nombre_empresa || 'Sin proveedor',
            e.cantidad,
            new Date(e.fecha_entrada).toLocaleDateString('es-ES')
          ])
        ];
        const ws6 = XLSX.utils.aoa_to_sheet(entradas);
        XLSX.utils.book_append_sheet(wb, ws6, 'Últimas Entradas');
      }

      // Hoja 7: Últimas Salidas
      if (reportes.movimientos_recientes.salidas.length > 0) {
        const salidas = [
          ['ID Salida', 'Material', 'Destino', 'Cantidad', 'Fecha'],
          ...reportes.movimientos_recientes.salidas.map(s => [
            s.id_salida,
            s.materiales.nombre,
            s.destino || 'Sin destino',
            s.cantidad,
            new Date(s.fecha_salida).toLocaleDateString('es-ES')
          ])
        ];
        const ws7 = XLSX.utils.aoa_to_sheet(salidas);
        XLSX.utils.book_append_sheet(wb, ws7, 'Últimas Salidas');
      }

      // Generar archivo
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Reporte_Inventario_${fecha}.xlsx`;
      
      console.log('Generando archivo:', nombreArchivo);
      XLSX.writeFile(wb, nombreArchivo);
      console.log('Archivo generado exitosamente');
    } catch (error) {
      console.error('Error al generar Excel:', error);
      alert('Error al generar el archivo Excel. Revisa la consola para más detalles.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="text-gray-600 mt-4 text-lg">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error || !reportes) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">{error || 'No se pudieron cargar los reportes'}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-white">Reportería del Sistema</h1>
            <button
              onClick={descargarExcel}
              className="bg-white text-black px-6 py-2 rounded-xl hover:bg-gray-200 transition-colors font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar Excel
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Estadísticas Generales */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-3xl font-bold text-black">{reportes.estadisticas_generales.total_materiales}</div>
            <div className="text-sm text-gray-600 mt-1">Total Materiales</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📥</div>
            <div className="text-3xl font-bold text-black">{reportes.estadisticas_generales.total_entradas}</div>
            <div className="text-sm text-gray-600 mt-1">Total Entradas</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📤</div>
            <div className="text-3xl font-bold text-black">{reportes.estadisticas_generales.total_salidas}</div>
            <div className="text-sm text-gray-600 mt-1">Total Salidas</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-3xl font-bold text-black">{reportes.estadisticas_generales.total_proveedores}</div>
            <div className="text-sm text-gray-600 mt-1">Proveedores</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-black">S/. {parseFloat(reportes.estadisticas_generales.valor_total_inventario).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div>
            <div className="text-sm text-gray-600 mt-1">Valor Inventario</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Materiales con Stock Bajo */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              Stock Bajo (Menos de 10 unidades)
            </h2>

            {reportes.stock_bajo.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-600">No hay materiales con stock bajo</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportes.stock_bajo.map((material) => (
                  <div key={material.id_material} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <div className="font-semibold text-black">{material.nombre}</div>
                      <div className="text-sm text-gray-600">{material.unidad_medida}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${material.stock_actual === 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        {material.stock_actual}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Materiales Más Utilizados */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              Materiales Más Utilizados
            </h2>

            {reportes.materiales_mas_utilizados.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-600">No hay datos de salidas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportes.materiales_mas_utilizados.map((material, index) => (
                  <div key={material.id_material} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      <div>
                        <div className="font-semibold text-black">{material.nombre}</div>
                        <div className="text-sm text-gray-600">{material.unidad_medida}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-black">{material.cantidad_salidas}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Proveedores Frecuentes */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              Proveedores Más Frecuentes
            </h2>

            {reportes.proveedores_frecuentes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-600">No hay datos de proveedores</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportes.proveedores_frecuentes.map((proveedor, index) => (
                  <div key={proveedor.id_proveedor} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      <div>
                        <div className="font-semibold text-black">{proveedor.nombre_empresa}</div>
                        <div className="text-sm text-gray-600">{proveedor.contacto || 'Sin contacto'}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-black">{proveedor.cantidad_entradas}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Materiales por Valor */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <span className="text-2xl">💎</span>
              Top Materiales por Valor
            </h2>

            {reportes.top_materiales_por_valor.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-600">No hay materiales</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportes.top_materiales_por_valor.map((material, index) => (
                  <div key={material.id_material} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      <div>
                        <div className="font-semibold text-black">{material.nombre}</div>
                        <div className="text-sm text-gray-600">
                          Stock: {material.stock_actual} {material.unidad_medida}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-black">
                        S/. {material.valor_total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Movimientos Recientes */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Entradas Recientes */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <span className="text-2xl">📥</span>
              Últimas Entradas
            </h2>

            {reportes.movimientos_recientes.entradas.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-600">No hay entradas recientes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportes.movimientos_recientes.entradas.map((entrada) => (
                  <div key={entrada.id_entrada} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-black">{entrada.materiales.nombre}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(entrada.fecha_entrada).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {entrada.proveedores?.nombre_empresa || 'Sin proveedor'}
                      </div>
                      <div className="font-bold text-black">+{entrada.cantidad}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Salidas Recientes */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <span className="text-2xl">📤</span>
              Últimas Salidas
            </h2>

            {reportes.movimientos_recientes.salidas.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-600">No hay salidas recientes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportes.movimientos_recientes.salidas.map((salida) => (
                  <div key={salida.id_salida} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-black">{salida.materiales.nombre}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(salida.fecha_salida).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">{salida.destino || 'Sin destino'}</div>
                      <div className="font-bold text-black">-{salida.cantidad}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  // Verificar token en servidor y redirigir a /login si no está autenticado
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const user = token ? verifyToken(token) : null
  if (!user) redirect('/login')
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo del sistema"
              width={120}
              height={40}
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Sistema de Inventario
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-4">
            Obras de Construcción
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Gestiona tus materiales de construcción de forma eficiente con nuestra plataforma integral de inventario.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Gestión de Materiales */}
          <div className="group">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-black mb-4 text-center">Gestión de Materiales</h3>
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                Administra tu inventario completo: consulta, registra y edita materiales de construcción.
              </p>
              
              <Link href="/materiales">
                <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                  Gestionar Materiales
                </button>
              </Link>
            </div>
          </div>

          {/* Entradas y Salidas */}
          <div className="group">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-black mb-4 text-center">Movimientos</h3>
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                Controla entradas y salidas de materiales, registra movimientos y consulta historial.
              </p>
              
              <Link href="/movimientos">
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                  Gestionar Movimientos
                </button>
              </Link>
            </div>
          </div>

          {/* Proveedores */}
          <div className="group">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-600 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-black mb-4 text-center">Proveedores</h3>
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                Administra tu red de proveedores y mantén actualizada la información de contacto.
              </p>
              
              <Link href="/materiales/proveedores">
                <button className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                  Ver Proveedores
                </button>
              </Link>
            </div>
          </div>

        </div>

        {/* Sección adicional para Reportes y Usuarios (Admin) */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Herramientas Adicionales</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Reportería */}
            <div className="group">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-black mb-4 text-center">Reportería</h3>
                <p className="text-gray-600 mb-8 text-center leading-relaxed">
                  Consulta estadísticas, reportes y análisis detallados del inventario y movimientos.
                </p>
                
                <Link href="/reportes">
                  <button className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    Ver Reportes
                  </button>
                </Link>
              </div>
            </div>

            {/* Gestión de Usuarios (solo Admin) */}
            {user.role === 'Admin' && (
              <div className="group">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-black mb-4 text-center">Gestión de Usuarios</h3>
                  <p className="text-gray-600 mb-8 text-center leading-relaxed">
                    Administra usuarios del sistema, roles y permisos. Resetea contraseñas cuando sea necesario.
                  </p>
                  
                  <Link href="/usuarios">
                    <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                      Administrar Usuarios
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">📦</div>
            <div className="text-black font-semibold">Inventario</div>
            <div className="text-gray-600 text-sm">Control total</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">📊</div>
            <div className="text-black font-semibold">Reportes</div>
            <div className="text-gray-600 text-sm">En tiempo real</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">🔒</div>
            <div className="text-black font-semibold">Seguridad</div>
            <div className="text-gray-600 text-sm">Datos protegidos</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-black border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-gray-400">
            © 2024 Sistema de Inventario - Desarrollado con Next.js y Prisma
          </p>
        </div>
      </footer>
    </div>
  );
}

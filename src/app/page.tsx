import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid place-items-center min-h-screen p-8 sm:p-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="text-center space-y-6">
        <Image
          className="mx-auto dark:invert"
          src="/logo.png"
          alt="Logo del sistema"
          width={180}
          height={60}
          priority
        />

        <h1 className="text-3xl sm:text-4xl font-bold">
          Sistema de Inventario para Obras de Construcción
        </h1>

        <p className="text-lg sm:text-xl max-w-xl mx-auto">
          Gestiona tus materiales de construcción de forma eficiente: consulta, registra y edita materiales fácilmente.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link href="/materiales">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Ver Materiales
            </button>
          </Link>

          <Link href="/materiales/crear">
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Registrar Material
            </button>
          </Link>

          <Link href="/materiales/entradas">
            <button className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition">
              Registrar Entrada
            </button>
          </Link>

          <Link href="/materiales/salidas">
            <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
              Ver Salidas
            </button>
          </Link>

          <Link href="/materiales/salidas/registrar">
            <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition">
              Registrar Salida
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

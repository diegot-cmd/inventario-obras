// src/app/materiales/crear/page.tsx
'use client'

import CrearMaterialForm from '@/app/components/CrearMaterialForm'
import Link from 'next/link'

export default function CrearPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Registrar Nuevo Material</h1>
      <CrearMaterialForm />

      {/* Botón para volver */}
      <Link
        href="/materiales"
        className="mt-4 inline-block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Volver a la lista
      </Link>
    </div>
  )
}

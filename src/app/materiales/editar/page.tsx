// src/app/materiales/editar/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import EditarMaterialForm from '@/app/components/EditarMaterialform'
import Link from 'next/link'

export default function EditarMaterialPage() {
  const params = useParams()
  const id = Number(params.id)

  if (!id) return <p>ID inválido</p>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Editar Material</h1>
      <EditarMaterialForm editId={id} />

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

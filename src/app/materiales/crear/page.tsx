'use client'

import { useRouter } from 'next/navigation'
import CrearMaterialForm from '@/app/components/CrearMaterialForm'

export default function CrearPage() {
  const router = useRouter()

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
      >
        ← Volver
      </button>
      <h1 className="text-xl font-bold mb-4">Registrar Nuevo Material</h1>
      <CrearMaterialForm />
    </div>
  )
}


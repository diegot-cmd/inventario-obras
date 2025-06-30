// src/app/materiales/crear/page.tsx
'use client'

import CrearMaterialForm from '@/app/components/CrearMaterialForm'

export default function CrearPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Registrar Nuevo Material</h1>
      <CrearMaterialForm />
    </div>
  )
}

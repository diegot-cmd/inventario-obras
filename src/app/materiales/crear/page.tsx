// src/app/materiales/crear/page.tsx
'use client'

import CrearMaterialForm from '@/app/components/CrearMaterialForm'
import BotonVolver from '@/app/components/BotonVolver'

export default function CrearPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Registrar Nuevo Material</h1>
      <CrearMaterialForm />
      <BotonVolver />
    </div>
  )
}



// src/app/materiales/editar/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import EditarMaterialForm from '@/app/components/EditarMaterialform'
import BotonVolver from '@/app/components/BotonVolver'

export default function EditarMaterialPage() {
  const params = useParams()
  const id = Number(params.id)

  if (!id) return <p>ID inválido</p>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Editar Material</h1>
      <EditarMaterialForm editId={id} />
      <BotonVolver />
    </div>
  )
}


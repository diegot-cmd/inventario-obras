'use client'

import Link from 'next/link'

export default function BotonVolver() {
  return (
    <Link
      href="/materiales"
      className="fixed bottom-4 left-4 px-4 py-2 bg-red-600 text-white rounded shadow-md hover:bg-red-700 transition z-50"
    >
      ← Volver a la lista
    </Link>
  )
}

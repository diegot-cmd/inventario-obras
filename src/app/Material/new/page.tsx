// app/material/new/page.tsx
'use client'
import { useState } from 'react';

export default function NewMaterialPage() {
  const [nombre, setNombre] = useState('');
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/materiales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, unidad, cantidad })
    });
    if (res.ok) {
      alert('Material registrado');
      window.location.href = '/material';
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registrar Material</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Nombre" className="border p-2 w-full" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input placeholder="Unidad (kg, m3...)" className="border p-2 w-full" value={unidad} onChange={e => setUnidad(e.target.value)} />
        <input type="number" placeholder="Cantidad" className="border p-2 w-full" value={cantidad} onChange={e => setCantidad(+e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
      </form>
    </main>
  );
}

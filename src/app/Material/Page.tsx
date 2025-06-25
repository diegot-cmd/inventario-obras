"use client";
import Link from "next/link";

const mockData = [
  { id: 1, nombre: "Cemento", descripcion: "Bolsa de cemento Portland", cantidad: 100, unidad: "kg", ubicacion: "Almacén A" },
  { id: 2, nombre: "Arena", descripcion: "Arena fina", cantidad: 30, unidad: "m³", ubicacion: "Depósito B" },
];

export default function MaterialList() {
  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventario de Materiales</h1>
        <Link href="/material/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Agregar Material
        </Link>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Cantidad</th>
            <th className="p-2 border">Unidad</th>
            <th className="p-2 border">Ubicación</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((material) => (
            <tr key={material.id} className="text-center">
              <td className="p-2 border">{material.nombre}</td>
              <td className="p-2 border">{material.cantidad}</td>
              <td className="p-2 border">{material.unidad}</td>
              <td className="p-2 border">{material.ubicacion}</td>
              <td className="p-2 border">
                <Link href={`/material/${material.id}`} className="text-blue-600 hover:underline mr-2">
                  Editar
                </Link>
                <button className="text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
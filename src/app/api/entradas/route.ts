// src/app/api/entradas/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  const data = await req.json()

  const { id_material, cantidad, id_proveedor, fecha_entrada } = data

  if (!id_material || !cantidad || !fecha_entrada) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  try {
    const fecha = new Date(fecha_entrada)
    if (isNaN(fecha.getTime())) {
      return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 })
    }

    const entrada = await prisma.entradasmaterial.create({
      data: {
        id_material: Number(id_material),
        cantidad: Number(cantidad),
        id_proveedor: id_proveedor ? Number(id_proveedor) : null,
        fecha_entrada: fecha,
      },
    })

    // ✅ Actualizar el stock del material
    await prisma.materiales.update({
      where: { id_material: Number(id_material) },
      data: {
        stock_actual: {
          increment: Number(cantidad),
        },
      },
    })

    return NextResponse.json({ message: 'Entrada registrada', entrada })
  } catch (error) {
    console.error('Error al registrar entrada:', error)
    return NextResponse.json({ error: 'No se pudo registrar entrada' }, { status: 500 })
  }
}

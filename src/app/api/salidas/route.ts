import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  const data = await req.json()
  const { id_material, cantidad, destino, fecha_salida } = data

  if (!id_material || !cantidad || !fecha_salida) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  try {
    const fecha = new Date(fecha_salida)
    if (isNaN(fecha.getTime())) {
      return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 })
    }

    const salida = await prisma.salidasmaterial.create({
      data: {
        id_material: Number(id_material),
        cantidad: Number(cantidad),
        destino,
        fecha_salida: fecha,
      },
    })

    // Actualiza stock
    await prisma.materiales.update({
      where: { id_material: Number(id_material) },
      data: { stock_actual: { decrement: Number(cantidad) } },
    })

    return NextResponse.json({ message: 'Salida registrada', salida })
  } catch (error) {
    console.error('Error al registrar salida:', error)
    return NextResponse.json({ error: 'No se pudo registrar salida' }, { status: 500 })
  }
}

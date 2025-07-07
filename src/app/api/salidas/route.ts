import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  const data = await req.json()
  const { id_material, cantidad, destino, fecha_salida } = data

  if (!id_material || !cantidad || !fecha_salida) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  try {
   const fecha = new Date(`${fecha_salida}T12:00:00`) // para salidas
    if (isNaN(fecha.getTime())) {
      return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 })
    }

    const material = await prisma.materiales.findUnique({
      where: { id_material: Number(id_material) },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material no encontrado' }, { status: 404 })
    }

    if (material.stock_actual < Number(cantidad)) {
      return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 })
    }

    // Registra la salida
    const salida = await prisma.salidasmaterial.create({
      data: {
        id_material: Number(id_material),
        cantidad: Number(cantidad),
        destino,
        fecha_salida: fecha,
      },
    })

    // Actualiza el stock
    await prisma.materiales.update({
      where: { id_material: Number(id_material) },
      data: {
        stock_actual: {
          decrement: Number(cantidad),
        },
      },
    })

    return NextResponse.json({ message: 'Salida registrada', salida })
  } catch (error) {
    console.error('Error al registrar salida:', error)
    return NextResponse.json({ error: 'No se pudo registrar salida' }, { status: 500 })
  }
}
export async function GET() {
  try {
    const salidas = await prisma.salidasmaterial.findMany({
      include: {
        materiales: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        fecha_salida: 'desc',
      },
    })

    return NextResponse.json(salidas)
  } catch (error) {
    console.error('Error al obtener salidas:', error)
    return NextResponse.json({ error: 'No se pudieron obtener salidas' }, { status: 500 })
  }
}

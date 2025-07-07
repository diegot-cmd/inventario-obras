// src/app/api/entradas/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { id_material, cantidad, fecha_entrada, id_proveedor } = data

    if (!id_material || !cantidad || !fecha_entrada) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Validar existencia del material antes de insertar
    const materialExistente = await prisma.materiales.findUnique({
      where: { id_material: Number(id_material) }
    })

    if (!materialExistente) {
      return NextResponse.json({ error: 'El material no existe' }, { status: 404 })
    }

  const fecha = new Date(`${fecha_entrada}T12:00:00`) // para entradas
    if (isNaN(fecha.getTime())) {
      return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 })
    }

    const entrada = await prisma.entradasmaterial.create({
      data: {
        id_material: Number(id_material),
        cantidad: Number(cantidad),
        fecha_entrada: fecha,
        id_proveedor: id_proveedor ? Number(id_proveedor) : null
      }
    })

    await prisma.materiales.update({
      where: { id_material: Number(id_material) },
      data: {
        stock_actual: {
          increment: Number(cantidad)
        }
      }
    })

    return NextResponse.json({ message: 'Entrada registrada', entrada })
  } catch (error) {
    console.error('Error al registrar entrada:', error)
    return NextResponse.json({ error: 'No se pudo registrar entrada' }, { status: 500 })
  }
}
export async function GET() {
  try {
    const entradas = await prisma.entradasmaterial.findMany({
      include: {
        materiales: true,
        proveedores: true,
      },
      orderBy: { fecha_entrada: 'desc' }
    })

    return NextResponse.json(entradas)
  } catch (error) {
    console.error('Error al obtener entradas:', error)
    return NextResponse.json({ error: 'Error al obtener entradas' }, { status: 500 })
  }
}
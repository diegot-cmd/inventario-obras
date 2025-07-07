import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { nombre, descripcion, unidad_medida, precio_unitario, fecha_registro, stock_actual } = data

    if (!nombre || !unidad_medida || !precio_unitario) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Validar duplicado
    const existente = await prisma.materiales.findFirst({
      where: { nombre: nombre.trim() },
    })

    if (existente) {
      return NextResponse.json({ error: 'Ya existe un material con ese nombre' }, { status: 400 })
    }

    // Corregir desfase de zona horaria
    const fecha = fecha_registro
      ? new Date(new Date(fecha_registro).getTime() + new Date().getTimezoneOffset() * 60000)
      : new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000)

    const nuevo = await prisma.materiales.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion || '',
        unidad_medida,
        precio_unitario: parseFloat(precio_unitario),
        fecha_registro: fecha,
        stock_actual: stock_actual ? parseInt(stock_actual) : 0,
      },
    })

    return NextResponse.json(nuevo)
  } catch (error) {
    console.error('Error al registrar material:', error)
    return NextResponse.json({ error: 'No se pudo registrar el material' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const materiales = await prisma.materiales.findMany({
      orderBy: { fecha_registro: 'desc' },
    })
    return NextResponse.json(materiales)
  } catch (error) {
    console.error('Error al obtener materiales:', error)
    return NextResponse.json({ error: 'No se pudieron obtener los materiales' }, { status: 500 })
  }
}

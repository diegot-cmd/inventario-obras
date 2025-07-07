import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { nombre, descripcion, unidad_medida, precio_unitario, fecha_registro } = data

    // Validación básica
    if (!nombre || !unidad_medida || !precio_unitario) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Verificar duplicado por nombre
    const existente = await prisma.materiales.findFirst({
      where: { nombre: nombre.trim() },
    })

    if (existente) {
      return NextResponse.json({ error: 'Ya existe un material con ese nombre' }, { status: 400 })
    }

    // Corregir desfase de zona horaria
    const fecha = fecha_registro
      ? new Date(new Date(fecha_registro).getTime() - new Date(fecha_registro).getTimezoneOffset() * 60000)
      : new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)

    // Guardar material
    const nuevo = await prisma.materiales.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion || '',
        unidad_medida,
        precio_unitario: parseFloat(precio_unitario),
        fecha_registro: fecha,
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

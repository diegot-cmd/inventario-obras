import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { nombre, descripcion, unidad_medida, precio_unitario, fecha_registro } = data

    // Validar campos obligatorios
    if (!nombre || !unidad_medida || !precio_unitario) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Verificar si el material ya existe por nombre
    const existe = await prisma.materiales.findFirst({
      where: { nombre: nombre.trim() },
    })

    if (existe) {
      return NextResponse.json({ error: 'El material ya existe' }, { status: 409 })
    }

    // Convertir fecha sin desfase (asumiendo input tipo "YYYY-MM-DD")
    const fecha = fecha_registro
      ? new Date(fecha_registro + 'T00:00:00')
      : new Date()

    // Crear material
    const nuevoMaterial = await prisma.materiales.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion || null,
        unidad_medida,
        precio_unitario: Number(precio_unitario),
        fecha_registro: fecha,
        stock_actual: 0, // stock inicial
      },
    })

    return NextResponse.json({ message: 'Material registrado', material: nuevoMaterial })
  } catch (error) {
    console.error('Error al registrar material:', error)
    return NextResponse.json({ error: 'Error al registrar material' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const materiales = await prisma.materiales.findMany({
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json(materiales)
  } catch (error) {
    console.error('Error al obtener materiales:', error)
    return NextResponse.json({ error: 'Error al obtener materiales' }, { status: 500 })
  }
}

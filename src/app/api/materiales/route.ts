import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const {
      nombre,
      descripcion,
      unidad_medida,
      precio_unitario,
      stock_actual,
      fecha_registro,
    } = data

    // Validación de campos obligatorios
    if (!nombre || !unidad_medida || !precio_unitario) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Validar y construir fecha
    let fecha: Date

    if (fecha_registro && typeof fecha_registro === 'string' && !isNaN(Date.parse(fecha_registro))) {
      // El valor debe venir en formato 'YYYY-MM-DD'
      fecha = new Date(fecha_registro + 'T00:00:00')
    } else {
      // Fecha de hoy sin hora
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      fecha = hoy
    }

    // Crear material en la BD
    const nuevoMaterial = await prisma.materiales.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion || null,
        unidad_medida,
        precio_unitario: parseFloat(precio_unitario),
        stock_actual: parseInt(stock_actual) || 0,
        fecha_registro: fecha,
      },
    })

    return NextResponse.json(nuevoMaterial)
  } catch (error) {
    console.error('Error al registrar material:', error)
    return NextResponse.json({ error: 'No se pudo registrar el material' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const materiales = await prisma.materiales.findMany({
      orderBy: {
        fecha_registro: 'desc',
      },
    })

    return NextResponse.json(materiales)
  } catch (error) {
    console.error('Error al obtener materiales:', error)
    return NextResponse.json({ error: 'No se pudieron obtener los materiales' }, { status: 500 })
  }
}

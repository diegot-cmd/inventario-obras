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

    if (!nombre || !unidad_medida || !precio_unitario) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Verificar si ya existe un material con el mismo nombre
    const existente = await prisma.materiales.findFirst({
      where: {
        nombre: nombre.trim(),
      },
    })

    if (existente) {
      return NextResponse.json({ error: 'Ya existe un material con ese nombre' }, { status: 409 })
    }

    
 // Evita desfase horario: fuerza 00:00:00 local
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const fecha = fecha_registro
  ? new Date(fecha_registro + 'T00:00:00')
  : hoy;

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

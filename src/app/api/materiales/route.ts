import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET → Listar todos los materiales
export async function GET() {
  try {
    const materiales = await prisma.materiales.findMany();
    return NextResponse.json(materiales);
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    return NextResponse.json({ error: 'Error al obtener materiales' }, { status: 500 });
  }
}

// POST → Crear nuevo material
export async function POST(req: Request) {
  const data = await req.json()
  const { nombre, descripcion, unidad_medida, precio_unitario, fecha_registro } = data

  if (!nombre || !unidad_medida || !precio_unitario) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  // Validar si ya existe el material
  const existente = await prisma.materiales.findFirst({
    where: {
      nombre: {
        equals: nombre,
      
      },
    },
  })

  if (existente) {
    return NextResponse.json({ error: 'El material ya existe' }, { status: 400 })
  }

  const fecha = fecha_registro ? new Date(fecha_registro) : new Date()

  try {
    const nuevoMaterial = await prisma.materiales.create({
      data: {
        nombre,
        descripcion,
        unidad_medida,
        precio_unitario: parseFloat(precio_unitario),
        fecha_registro: fecha,
      },
    })
    return NextResponse.json(nuevoMaterial)
  } catch (error) {
    console.error('Error al registrar material:', error)
    return NextResponse.json({ error: 'No se pudo registrar el material' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// POST: Crear nuevo material
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nombre,
      descripcion,
      unidad_medida,
      precio_unitario,
      stock_actual,
      fecha_registro
    } = body;

    // Validar campos obligatorios
    if (!nombre || !unidad_medida || !precio_unitario || !stock_actual || !fecha_registro) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Convertir la fecha directamente sin validar si es de hoy o mañana
    const fechaIngresada = new Date(fecha_registro);

    const nuevo = await prisma.materiales.create({
      data: {
        nombre,
        descripcion,
        unidad_medida,
        precio_unitario: parseFloat(precio_unitario),
        stock_actual: parseInt(stock_actual),
        fecha_registro: fechaIngresada,
      },
    });

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error('Error al registrar material:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// GET: Obtener todos los materiales
export async function GET() {
  try {
    const materiales = await prisma.materiales.findMany({
      select: {
        id_material: true,
        nombre: true,
      },
    })

    return NextResponse.json(materiales)
  } catch (error) {
    console.error('Error al obtener materiales:', error)
    return NextResponse.json({ error: 'No se pudo obtener materiales' }, { status: 500 })
  }
}
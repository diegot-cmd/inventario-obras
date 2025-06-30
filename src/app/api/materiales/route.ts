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
  const data = await req.json();

  const nombre = data.nombre || '';
  const descripcion = data.descripcion || '';
  const unidad_medida = data.unidad_medida || 'Und';
  const precio_unitario = isNaN(Number(data.precio_unitario)) ? 0 : Number(data.precio_unitario);
  const stock_actual = isNaN(Number(data.stock_actual)) ? 0 : Number(data.stock_actual);
  const fecha = data.fecha_registro ? new Date(data.fecha_registro) : new Date();

  // Validaciones básicas
  if (!nombre || !unidad_medida) {
    return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 });
  }

  try {
    const nuevo = await prisma.materiales.create({
      data: {
        nombre,
        descripcion,
        unidad_medida,
        precio_unitario,
        stock_actual,
        fecha_registro: fecha,
      },
    });
    return NextResponse.json(nuevo);
  } catch (error) {
    console.error('Error al crear material:', error);
    return NextResponse.json({ error: 'No se pudo registrar el material' }, { status: 500 });
  }
}

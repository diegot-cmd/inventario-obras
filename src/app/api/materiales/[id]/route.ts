import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// ✅ GET: Obtener material por ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = await Promise.resolve(context);
  const id = Number(params.id);

  try {
    const material = await prisma.materiales.findUnique({
      where: { id_material: id },
    });

    if (!material) {
      return NextResponse.json({ error: 'Material no encontrado' }, { status: 404 });
    }

    return NextResponse.json(material);
  } catch (error) {
    console.error('Error al obtener material:', error);
    return NextResponse.json({ error: 'Error al obtener material' }, { status: 500 });
  }
}

// ✅ PUT: Actualizar material por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const data = await req.json();

  const fecha_registro = new Date(data.fecha_registro);

  try {
    const actualizado = await prisma.materiales.update({
      where: { id_material: id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        unidad_medida: data.unidad_medida,
        precio_unitario: parseFloat(data.precio_unitario),
        stock_actual: parseInt(data.stock_actual),
        fecha_registro: fecha_registro,
      },
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar:', error);
    return NextResponse.json({ error: 'Error al actualizar el material' }, { status: 500 });
  }
}

// DELETE: Eliminar material
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    await prisma.materiales.delete({ where: { id_material: id } });
    return NextResponse.json({ message: 'Material eliminado' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    return NextResponse.json({ error: 'Error al eliminar material' }, { status: 500 });
  }
}
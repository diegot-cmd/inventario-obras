import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// ✅ GET: Obtener material por ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const id = context.params?.id
  const idMaterial = Number(id)

  if (isNaN(idMaterial)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const material = await prisma.materiales.findUnique({
      where: { id_material: idMaterial },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material no encontrado' }, { status: 404 })
    }

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error al obtener material:', error)
    return NextResponse.json({ error: 'Error al obtener material' }, { status: 500 })
  }
}

// ✅ PUT: Actualizar material por ID
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const id = context.params?.id
  const idMaterial = Number(id)

  if (isNaN(idMaterial)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const data = await req.json()

  let fecha: Date
  try {
    fecha = new Date(data.fecha_registro)
    if (isNaN(fecha.getTime())) {
      return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 })
  }

  try {
    const actualizado = await prisma.materiales.update({
      where: { id_material: idMaterial },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        unidad_medida: data.unidad_medida,
        precio_unitario: Number(data.precio_unitario),
        stock_actual: Number(data.stock_actual),
        fecha_registro: fecha,
      },
    })

    return NextResponse.json(actualizado)
  } catch (error) {
    console.error('Error al actualizar:', error)
    return NextResponse.json({ error: 'No se pudo actualizar' }, { status: 500 })
  }
}

// ✅ DELETE: Eliminar material por ID
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const id = context.params?.id
  const idMaterial = Number(id)

  if (isNaN(idMaterial)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    await prisma.materiales.delete({
      where: { id_material: idMaterial },
    })

    return NextResponse.json({ message: 'Material eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar:', error)
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 })
  }
}

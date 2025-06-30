import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Actualizar proveedor
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const data = await req.json()

  try {
    const proveedorActualizado = await prisma.proveedores.update({
      where: { id_proveedor: id },
      data: {
        nombre_empresa: data.nombre_empresa,
        contacto: data.contacto || null,
        telefono: data.telefono || null,
        email: data.email || null,
        direccion: data.direccion || null,
      },
    })
    return NextResponse.json(proveedorActualizado)
  } catch (error) {
    console.error('Error al actualizar proveedor:', error)
    return NextResponse.json({ error: 'No se pudo actualizar' }, { status: 500 })
  }
}

// Eliminar proveedor
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)

  try {
    await prisma.proveedores.delete({
      where: { id_proveedor: id },
    })
    return NextResponse.json({ message: 'Proveedor eliminado' })
  } catch (error) {
    console.error('Error al eliminar proveedor:', error)
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 })
  }
}

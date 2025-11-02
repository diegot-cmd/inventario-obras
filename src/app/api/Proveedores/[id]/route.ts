import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { nombre_empresa, contacto, telefono, email, direccion } = body

    const proveedor = await prisma.proveedores.update({
      where: { id_proveedor: id },
      data: {
        nombre_empresa,
        contacto,
        telefono,
        email,
        direccion,
      },
    })

    return NextResponse.json(proveedor)
  } catch (error) {
    console.error('Error al actualizar proveedor:', error)
    return NextResponse.json(
      { error: 'Error al actualizar proveedor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await prisma.proveedores.delete({
      where: { id_proveedor: id },
    })

    return NextResponse.json({ message: 'Proveedor eliminado' })
  } catch (error) {
    console.error('Error al eliminar proveedor:', error)
    return NextResponse.json(
      { error: 'Error al eliminar proveedor' },
      { status: 500 }
    )
  }
}
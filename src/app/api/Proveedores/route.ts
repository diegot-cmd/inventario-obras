import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const proveedores = await prisma.proveedores.findMany({
      orderBy: {
        nombre_empresa: 'asc',
      },
    })
    return NextResponse.json(proveedores)
  } catch (error) {
    console.error('Error al obtener proveedores:', error)
    return NextResponse.json(
      { error: 'Error al obtener proveedores' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre_empresa, contacto, telefono, email, direccion } = body

    const proveedor = await prisma.proveedores.create({
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
    console.error('Error al crear proveedor:', error)
    return NextResponse.json(
      { error: 'Error al crear proveedor' },
      { status: 500 }
    )
  }
}
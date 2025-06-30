import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const proveedores = await prisma.proveedores.findMany()
  return NextResponse.json(proveedores)
}

export async function POST(req: Request) {
  const data = await req.json()
  const { nombre_empresa, contacto, telefono, email, direccion } = data

  if (!nombre_empresa) {
    return NextResponse.json({ error: 'El nombre de la empresa es obligatorio' }, { status: 400 })
  }

  try {
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
    return NextResponse.json({ error: 'No se pudo registrar el proveedor' }, { status: 500 })
  }
}

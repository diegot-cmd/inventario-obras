import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const proveedores = await prisma.proveedores.findMany({
      select: {
        id_proveedor: true,
        nombre_empresa: true,
      },
    })

    return NextResponse.json(proveedores)
  } catch (error) {
    console.error('Error al obtener proveedores:', error)
    return NextResponse.json({ error: 'No se pudo obtener proveedores' }, { status: 500 })
  }
}
export async function POST(req: Request) {
  const data = await req.json()

  const { id_material, cantidad, fecha_entrada, id_proveedor } = data

  if (!id_material || !cantidad || !fecha_entrada) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  try {
    const entrada = await prisma.entradasmaterial.create({
      data: {
        id_material: Number(id_material),
        cantidad: Number(cantidad),
        fecha_entrada: new Date(fecha_entrada),
        id_proveedor: id_proveedor ? Number(id_proveedor) : null,
      },
    })

    return NextResponse.json(entrada)
  } catch (error) {
    console.error('Error al registrar entrada:', error)
    return NextResponse.json({ error: 'Error al registrar entrada' }, { status: 500 })
  }
}
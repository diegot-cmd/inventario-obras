import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const data = await req.json()
  const { nombre, email, password, role } = data

  if (!nombre || !email || !password) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  try {
    const existing = await prisma.usuario.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email ya registrado' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashed,
        role,
      },
    })

    return NextResponse.json({ message: 'Usuario creado', id_usuario: usuario.id_usuario })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json({ error: 'No se pudo crear usuario' }, { status: 500 })
  }
}

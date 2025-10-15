import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const data = await req.json()
  const { email, password } = data

  if (!email || !password) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      // registrar intento fallido si se desea
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, usuario.password)
    const ip = (req as any).headers?.get?.('x-forwarded-for') || (req as any).headers?.get?.('x-real-ip') || undefined

    await prisma.login.create({
  data: {
    exitoso: match,
    ip: ip ?? undefined,
    usuario: {
      connect: { id_usuario: usuario.id_usuario },
    },
  },
})


    if (!match) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // No se genera token aquí (puedes añadir JWT si lo necesitas)
    const safeUser = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
      creado_en: usuario.creado_en,
    }

    return NextResponse.json({ message: 'Login exitoso', usuario: safeUser })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ error: 'Error en autenticación' }, { status: 500 })
  }
}

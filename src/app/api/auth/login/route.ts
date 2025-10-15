import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })

    const match = await bcrypt.compare(password, usuario.password)
    if (!match) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })

    // Generar JWT
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    // Guardar login en DB (relación correcta)
    await prisma.login.create({
      data: {
        exitoso: true,
        ip: (req as any).headers?.get('x-forwarded-for') || undefined,
        usuario: { connect: { id_usuario: usuario.id_usuario } } // 🔹 corrección
      },
    })

    return NextResponse.json({
      message: 'Login exitoso',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      },
      token
    })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ error: 'Error en autenticación' }, { status: 500 })
  }
}

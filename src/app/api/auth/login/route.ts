import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura'

export async function POST(req: Request) {
  const data = await req.json()
  const { email, password } = data

  if (!email || !password) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, usuario.password)
    if (!match) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // 🔐 Generar token con los datos del usuario
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Guardar token en cookie
    const res = NextResponse.json({ message: 'Login exitoso' })
    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hora
    })

    return res
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ error: 'Error en autenticación' }, { status: 500 })
  }
}

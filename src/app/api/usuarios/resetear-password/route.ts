import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// POST - Resetear contraseña de usuario (solo Admin)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const user = token ? verifyToken(token) : null

    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id_usuario, nueva_password } = await req.json()

    if (!id_usuario || !nueva_password) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    if (nueva_password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const existingUser = await prisma.usuario.findUnique({ 
      where: { id_usuario: parseInt(id_usuario) } 
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(nueva_password, 10)

    await prisma.usuario.update({
      where: { id_usuario: parseInt(id_usuario) },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ 
      message: 'Contraseña actualizada correctamente',
      usuario: existingUser.nombre 
    })
  } catch (error) {
    console.error('Error al resetear contraseña:', error)
    return NextResponse.json({ error: 'Error al resetear contraseña' }, { status: 500 })
  }
}

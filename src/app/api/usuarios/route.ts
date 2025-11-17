import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// GET - Listar todos los usuarios (solo Admin)
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const user = token ? verifyToken(token) : null

    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        role: true,
        estado: true,
        creado_en: true,
      },
      orderBy: { creado_en: 'desc' },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

// POST - Crear nuevo usuario (solo Admin)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const user = token ? verifyToken(token) : null

    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { nombre, email, password, role } = await req.json()

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        role: role || 'Trabajador',
        estado: 'aprobado', // Usuarios creados por Admin se aprueban automáticamente
      },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        role: true,
        estado: true,
        creado_en: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
  }
}

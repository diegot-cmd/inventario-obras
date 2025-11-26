import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// POST - Cambiar estado de un usuario (aprobar o rechazar) - Solo Admin
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const user = token ? verifyToken(token) : null

    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id_usuario, nuevo_estado } = await req.json()

    if (!id_usuario || !nuevo_estado) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Validar que el estado sea válido
    const estadosValidos = ['pendiente', 'aprobado', 'rechazado']
    if (!estadosValidos.includes(nuevo_estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id_usuario: parseInt(id_usuario) },
      data: { estado: nuevo_estado },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        role: true,
        estado: true,
        creado_en: true,
      },
    })

    return NextResponse.json({ 
      message: `Usuario ${nuevo_estado === 'aprobado' ? 'aprobado' : 'rechazado'} correctamente`,
      usuario: usuarioActualizado 
    })
  } catch (error) {
    console.error('Error al cambiar estado de usuario:', error)
    return NextResponse.json({ error: 'Error al cambiar estado' }, { status: 500 })
  }
}

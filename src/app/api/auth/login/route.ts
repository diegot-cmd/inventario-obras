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

    // Compatibilidad: si la contraseña en la BD está en texto plano (inserciones manuales),
    // permitir el login y luego migrar a bcrypt (rehash y update).
    let match = false
    const stored = usuario.password || ''
    const isBcryptHash = typeof stored === 'string' && /^\$2[aby]\$/.test(stored)

    if (isBcryptHash) {
      match = await bcrypt.compare(password, stored)
    } else {
      // contraseña almacenada en texto plano
      match = password === stored
      if (match) {
        // Re-hash y actualizar la contraseña en la base de datos para mejorar seguridad
        try {
          const newHash = await bcrypt.hash(password, 10)
          await prisma.usuario.update({
            where: { id_usuario: usuario.id_usuario },
            data: { password: newHash }
          })
        } catch (e) {
          console.error('Error al actualizar password a hash:', e)
        }
      }
    }

    if (!match) {
      // Registrar intento fallido si el usuario existe
      try {
        await prisma.login.create({
          data: {
            exitoso: false,
            ip: (req as any).headers?.get('x-forwarded-for') || undefined,
            usuario: { connect: { id_usuario: usuario.id_usuario } }
          }
        })
      } catch (e) {
        console.error('No se pudo registrar intento fallido de login:', e)
      }

      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Verificar JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no definido en el entorno')
      return NextResponse.json({ error: 'Configuración del servidor inválida' }, { status: 500 })
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Guardar login exitoso en DB
    await prisma.login.create({
      data: {
        exitoso: true,
        ip: (req as any).headers?.get('x-forwarded-for') || undefined,
        usuario: { connect: { id_usuario: usuario.id_usuario } }
      },
    })

    // Devolver token en cookie HttpOnly + respuesta JSON
    const res = NextResponse.json({
      message: 'Login exitoso',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      }
    })

    // Establecer cookie segura (HttpOnly)
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 // 1 hora
    })

    return res
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ error: 'Error en autenticación' }, { status: 500 })
  }
}

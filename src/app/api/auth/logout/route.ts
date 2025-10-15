import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: 'Sesión cerrada' })
  res.cookies.set('token', '', { path: '/', expires: new Date(0) }) // borrar cookie
  return res
}

import jwt from 'jsonwebtoken'

export function verifyToken(token: string): JwtUser | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser
    return decoded
  } catch {
    return null
  }
}
export interface JwtUser {
  id_usuario: number
  nombre: string
  email: string
  role: string
  creado_en: string
}

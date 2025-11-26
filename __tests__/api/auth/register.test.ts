// Mock de Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import prisma from '@/lib/prisma';
import { POST } from '@/app/api/auth/register/route';

describe('API - Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar error si faltan campos requeridos', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Nombre, email y contraseña son requeridos');
  });

  it('debería retornar error si el email ya está registrado', async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
      id_usuario: 1,
      email: 'existente@test.com',
    });

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ 
        nombre: 'Test User',
        email: 'existente@test.com',
        password: '123456'
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('El email ya está registrado');
  });

  it('debería crear un usuario con estado pendiente', async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.usuario.create as jest.Mock).mockResolvedValue({
      id_usuario: 1,
      nombre: 'Test User',
      email: 'nuevo@test.com',
      role: 'Trabajador',
      estado: 'pendiente',
    });

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ 
        nombre: 'Test User',
        email: 'nuevo@test.com',
        password: '123456'
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toContain('Usuario registrado');
    expect(prisma.usuario.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          nombre: 'Test User',
          email: 'nuevo@test.com',
          role: 'Trabajador',
          estado: 'pendiente',
        }),
      })
    );
  });
});

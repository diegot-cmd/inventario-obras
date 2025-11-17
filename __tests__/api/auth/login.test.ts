import { NextResponse } from 'next/server';

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
import { POST } from '@/app/api/auth/login/route';

describe('API - Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar error si falta el email', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: '123456' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email y contraseña son requeridos');
  });

  it('debería retornar error si falta la contraseña', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email y contraseña son requeridos');
  });

  it('debería retornar error si el usuario no existe', async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ 
        email: 'noexiste@test.com', 
        password: '123456' 
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Credenciales inválidas');
  });

  it('debería retornar error si el usuario no está aprobado', async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
      id_usuario: 1,
      email: 'test@test.com',
      password: 'hashedpassword',
      estado: 'pendiente',
    });

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ 
        email: 'test@test.com', 
        password: '123456' 
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toContain('Tu cuenta está pendiente de aprobación');
  });
});

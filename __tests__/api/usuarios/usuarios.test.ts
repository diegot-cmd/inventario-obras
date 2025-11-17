// Mock de Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    usuario: {
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from '@/lib/prisma';
import { GET } from '@/app/api/usuarios/route';
import { PUT, DELETE } from '@/app/api/usuarios/[id]/route';
import { POST as CambiarEstado } from '@/app/api/usuarios/cambiar-estado/route';

describe('API - Usuarios CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/usuarios', () => {
    it('debería retornar todos los usuarios', async () => {
      const mockUsuarios = [
        { 
          id_usuario: 1, 
          nombre: 'Admin User', 
          email: 'admin@test.com',
          role: 'Admin',
          estado: 'aprobado',
        },
        { 
          id_usuario: 2, 
          nombre: 'Worker User', 
          email: 'worker@test.com',
          role: 'Trabajador',
          estado: 'pendiente',
        },
      ];

      (prisma.usuario.findMany as jest.Mock).mockResolvedValue(mockUsuarios);

      const request = new Request('http://localhost:3000/api/usuarios');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUsuarios);
      expect(prisma.usuario.findMany).toHaveBeenCalled();
    });
  });

  describe('POST /api/usuarios/cambiar-estado', () => {
    it('debería cambiar el estado de un usuario a aprobado', async () => {
      (prisma.usuario.update as jest.Mock).mockResolvedValue({
        id_usuario: 2,
        estado: 'aprobado',
      });

      const request = new Request('http://localhost:3000/api/usuarios/cambiar-estado', {
        method: 'POST',
        body: JSON.stringify({ 
          id_usuario: 2,
          nuevo_estado: 'aprobado'
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await CambiarEstado(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('actualizado');
      expect(prisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id_usuario: 2 },
          data: { estado: 'aprobado' },
        })
      );
    });

    it('debería retornar error con estado inválido', async () => {
      const request = new Request('http://localhost:3000/api/usuarios/cambiar-estado', {
        method: 'POST',
        body: JSON.stringify({ 
          id_usuario: 2,
          nuevo_estado: 'invalido'
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await CambiarEstado(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Estado inválido');
    });
  });

  describe('PUT /api/usuarios/[id]', () => {
    it('debería actualizar un usuario', async () => {
      const usuarioActualizado = {
        nombre: 'Usuario Actualizado',
        role: 'Supervisor',
      };

      (prisma.usuario.update as jest.Mock).mockResolvedValue({
        id_usuario: 1,
        ...usuarioActualizado,
      });

      const request = new Request('http://localhost:3000/api/usuarios/1', {
        method: 'PUT',
        body: JSON.stringify(usuarioActualizado),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.nombre).toBe('Usuario Actualizado');
    });
  });

  describe('DELETE /api/usuarios/[id]', () => {
    it('debería eliminar un usuario', async () => {
      (prisma.usuario.delete as jest.Mock).mockResolvedValue({
        id_usuario: 2,
        nombre: 'Worker User',
      });

      const request = new Request('http://localhost:3000/api/usuarios/2', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: '2' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('eliminado');
    });
  });
});

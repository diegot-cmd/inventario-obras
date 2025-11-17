// Mock de Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    proveedores: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from '@/lib/prisma';
import { GET, POST } from '@/app/api/proveedores/route';
import { PUT, DELETE } from '@/app/api/proveedores/[id]/route';

describe('API - Proveedores CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/proveedores', () => {
    it('debería retornar todos los proveedores', async () => {
      const mockProveedores = [
        { id_proveedor: 1, nombre_empresa: 'Empresa A', contacto: 'Juan' },
        { id_proveedor: 2, nombre_empresa: 'Empresa B', contacto: 'Pedro' },
      ];

      (prisma.proveedores.findMany as jest.Mock).mockResolvedValue(mockProveedores);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProveedores);
      expect(prisma.proveedores.findMany).toHaveBeenCalled();
    });
  });

  describe('POST /api/proveedores', () => {
    it('debería crear un nuevo proveedor', async () => {
      const nuevoProveedor = {
        nombre_empresa: 'Constructora XYZ',
        contacto: 'María',
        telefono: '999888777',
        email: 'contacto@xyz.com',
        direccion: 'Av. Principal 123',
      };

      (prisma.proveedores.create as jest.Mock).mockResolvedValue({
        id_proveedor: 3,
        ...nuevoProveedor,
      });

      const request = new Request('http://localhost:3000/api/proveedores', {
        method: 'POST',
        body: JSON.stringify(nuevoProveedor),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.nombre_empresa).toBe('Constructora XYZ');
      expect(prisma.proveedores.create).toHaveBeenCalled();
    });

    it('debería retornar error si falta el nombre de empresa', async () => {
      const request = new Request('http://localhost:3000/api/proveedores', {
        method: 'POST',
        body: JSON.stringify({ contacto: 'Test' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('empresa es requerido');
    });
  });

  describe('PUT /api/proveedores/[id]', () => {
    it('debería actualizar un proveedor existente', async () => {
      const proveedorActualizado = {
        nombre_empresa: 'Empresa A Actualizada',
        telefono: '987654321',
      };

      (prisma.proveedores.update as jest.Mock).mockResolvedValue({
        id_proveedor: 1,
        ...proveedorActualizado,
      });

      const request = new Request('http://localhost:3000/api/proveedores/1', {
        method: 'PUT',
        body: JSON.stringify(proveedorActualizado),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.nombre_empresa).toBe('Empresa A Actualizada');
      expect(prisma.proveedores.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id_proveedor: 1 },
        })
      );
    });
  });

  describe('DELETE /api/proveedores/[id]', () => {
    it('debería eliminar un proveedor', async () => {
      (prisma.proveedores.delete as jest.Mock).mockResolvedValue({
        id_proveedor: 1,
        nombre_empresa: 'Empresa A',
      });

      const request = new Request('http://localhost:3000/api/proveedores/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('eliminado');
      expect(prisma.proveedores.delete).toHaveBeenCalledWith({
        where: { id_proveedor: 1 },
      });
    });
  });
});

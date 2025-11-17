// Mock de Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    material: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from '@/lib/prisma';
import { GET, POST } from '@/app/api/materiales/route';
import { GET as GETById, PUT, DELETE } from '@/app/api/materiales/[id]/route';

describe('API - Materiales CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/materiales', () => {
    it('debería retornar todos los materiales', async () => {
      const mockMateriales = [
        { id_material: 1, nombre: 'Cemento', stock_actual: 100 },
        { id_material: 2, nombre: 'Arena', stock_actual: 50 },
      ];

      (prisma.material.findMany as jest.Mock).mockResolvedValue(mockMateriales);

      const request = new Request('http://localhost:3000/api/materiales');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockMateriales);
      expect(prisma.material.findMany).toHaveBeenCalled();
    });
  });

  describe('POST /api/materiales', () => {
    it('debería crear un nuevo material', async () => {
      const nuevoMaterial = {
        nombre: 'Ladrillo',
        descripcion: 'Ladrillo King Kong',
        unidad_medida: 'Unidad',
        precio_unitario: 1.5,
        stock_actual: 1000,
      };

      (prisma.material.create as jest.Mock).mockResolvedValue({
        id_material: 3,
        ...nuevoMaterial,
      });

      const request = new Request('http://localhost:3000/api/materiales', {
        method: 'POST',
        body: JSON.stringify(nuevoMaterial),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.nombre).toBe('Ladrillo');
      expect(prisma.material.create).toHaveBeenCalled();
    });

    it('debería retornar error si falta el nombre', async () => {
      const request = new Request('http://localhost:3000/api/materiales', {
        method: 'POST',
        body: JSON.stringify({ descripcion: 'Test' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('requerido');
    });
  });

  describe('PUT /api/materiales/[id]', () => {
    it('debería actualizar un material existente', async () => {
      const materialActualizado = {
        nombre: 'Cemento Sol',
        precio_unitario: 25.5,
      };

      (prisma.material.update as jest.Mock).mockResolvedValue({
        id_material: 1,
        ...materialActualizado,
      });

      const request = new Request('http://localhost:3000/api/materiales/1', {
        method: 'PUT',
        body: JSON.stringify(materialActualizado),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.nombre).toBe('Cemento Sol');
      expect(prisma.material.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id_material: 1 },
        })
      );
    });
  });

  describe('DELETE /api/materiales/[id]', () => {
    it('debería eliminar un material', async () => {
      (prisma.material.delete as jest.Mock).mockResolvedValue({
        id_material: 1,
        nombre: 'Cemento',
      });

      const request = new Request('http://localhost:3000/api/materiales/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('eliminado');
      expect(prisma.material.delete).toHaveBeenCalledWith({
        where: { id_material: 1 },
      });
    });
  });
});

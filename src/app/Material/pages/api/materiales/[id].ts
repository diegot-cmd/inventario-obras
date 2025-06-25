// pages/api/materiales/[id].ts
import prisma from "../../../../../lib/db";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const material = await prisma.materiales.findUnique({ where: { id_material: Number(id) } });
    return res.status(200).json(material);
  }

   if (req.method === 'PUT') {
    try {
      const { nombre, descripcion, unidad_medida, precio_unitario, stock_actual, fecha_registro } =
        req.body;

      const actualizado = await prisma.materiales.update({
        where: { id_material: Number(id) },
        data: {
          nombre,
          descripcion,
          unidad_medida,
          precio_unitario: parseFloat(precio_unitario),
          stock_actual: parseInt(stock_actual),
          fecha_registro: new Date(fecha_registro),
        },
      });

      return res.status(200).json(actualizado);
    } catch (error) {
      console.error('Error al actualizar:', error);
      return res.status(500).json({ error: 'Error al actualizar el material' });
    }
  }

  if (req.method === "DELETE") {
    await prisma.materiales.delete({ where: { id_material: Number(id) } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

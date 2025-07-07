// pages/api/materiales/index.ts
import prisma from "../../../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const materiales = await prisma.materiales.findMany();
    return res.status(200).json(materiales);
  }

  if (req.method === "POST") {
    const { nombre, descripcion, unidad_medida, precio_unitario, stock_actual } = req.body;

    const nuevoMaterial = await prisma.materiales.create({
      data: {
        nombre,
        descripcion,
        unidad_medida,
        precio_unitario,
        stock_actual,
      },
    });

    return res.status(201).json(nuevoMaterial);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

// pages/api/materiales/index.ts
import prisma from "../../../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const materiales = await prisma.material.findMany();
    return res.status(200).json(materiales);
  }

  if (req.method === "POST") {
    const { nombre, descripcion, cantidad, unidad, ubicacion } = req.body;
    const nuevoMaterial = await prisma.material.create({
      data: { nombre, descripcion, cantidad, unidad, ubicacion },
    });
    return res.status(201).json(nuevoMaterial);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

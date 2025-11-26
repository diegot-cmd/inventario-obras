import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Listar todos los proveedores
export async function GET() {
  try {
    const proveedores = await prisma.proveedores.findMany({
      orderBy: { id_proveedor: 'desc' }
    });
    return NextResponse.json(proveedores);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return NextResponse.json(
      { error: "Error al obtener proveedores" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo proveedor
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre_empresa, contacto, telefono, email, direccion } = body;

    if (!nombre_empresa) {
      return NextResponse.json(
        { error: "El nombre de la empresa es requerido" },
        { status: 400 }
      );
    }

    const proveedor = await prisma.proveedores.create({
      data: {
        nombre_empresa,
        contacto: contacto || null,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
      },
    });

    return NextResponse.json(proveedor, { status: 201 });
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    return NextResponse.json(
      { error: "Error al crear proveedor" },
      { status: 500 }
    );
  }
}

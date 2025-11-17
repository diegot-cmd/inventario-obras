import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT: Actualizar un proveedor
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { nombre_empresa, contacto, telefono, email, direccion } = body;

    if (!nombre_empresa) {
      return NextResponse.json(
        { error: "El nombre de la empresa es requerido" },
        { status: 400 }
      );
    }

    const proveedor = await prisma.proveedores.update({
      where: { id_proveedor: id },
      data: {
        nombre_empresa,
        contacto: contacto || null,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
      },
    });

    return NextResponse.json(proveedor);
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    return NextResponse.json(
      { error: "Error al actualizar proveedor" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un proveedor
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.proveedores.delete({
      where: { id_proveedor: id },
    });

    return NextResponse.json({ message: "Proveedor eliminado" });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    return NextResponse.json(
      { error: "Error al eliminar proveedor" },
      { status: 500 }
    );
  }
}

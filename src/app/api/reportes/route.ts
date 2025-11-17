import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const user = token ? verifyToken(token) : null

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener estadísticas generales
    const totalMateriales = await prisma.materiales.count()
    const totalEntradas = await prisma.entradasmaterial.count()
    const totalSalidas = await prisma.salidasmaterial.count()
    const totalProveedores = await prisma.proveedores.count()

    // Valor total del inventario
    const materiales = await prisma.materiales.findMany({
      select: {
        stock_actual: true,
        precio_unitario: true,
      },
    })

    const valorTotal = materiales.reduce((sum, mat) => {
      return sum + (mat.stock_actual * Number(mat.precio_unitario))
    }, 0)

    // Materiales con stock bajo (menos de 10 unidades)
    const stockBajo = await prisma.materiales.findMany({
      where: {
        stock_actual: {
          lt: 10,
        },
      },
      select: {
        id_material: true,
        nombre: true,
        stock_actual: true,
        unidad_medida: true,
      },
      orderBy: {
        stock_actual: 'asc',
      },
    })

    // Materiales más utilizados (mayor cantidad de salidas)
    const materialesMasUtilizados = await prisma.salidasmaterial.groupBy({
      by: ['id_material'],
      _sum: {
        cantidad: true,
      },
      orderBy: {
        _sum: {
          cantidad: 'desc',
        },
      },
      take: 5,
    })

    const materialesUtilizadosConNombres = await Promise.all(
      materialesMasUtilizados.map(async (item) => {
        const material = await prisma.materiales.findUnique({
          where: { id_material: item.id_material },
          select: { nombre: true, unidad_medida: true },
        })
        return {
          id_material: item.id_material,
          nombre: material?.nombre || 'Desconocido',
          unidad_medida: material?.unidad_medida || '',
          cantidad_salidas: item._sum.cantidad || 0,
        }
      })
    )

    // Proveedores más frecuentes
    const proveedoresFrecuentes = await prisma.entradasmaterial.groupBy({
      by: ['id_proveedor'],
      _count: {
        id_entrada: true,
      },
      where: {
        id_proveedor: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          id_entrada: 'desc',
        },
      },
      take: 5,
    })

    const proveedoresConNombres = await Promise.all(
      proveedoresFrecuentes.map(async (item) => {
        if (!item.id_proveedor) return null
        const proveedor = await prisma.proveedores.findUnique({
          where: { id_proveedor: item.id_proveedor },
          select: { nombre_empresa: true, contacto: true },
        })
        return {
          id_proveedor: item.id_proveedor,
          nombre_empresa: proveedor?.nombre_empresa || 'Desconocido',
          contacto: proveedor?.contacto || '',
          cantidad_entradas: item._count.id_entrada,
        }
      })
    )

    // Movimientos recientes (últimas 10 entradas y salidas)
    const entradasRecientes = await prisma.entradasmaterial.findMany({
      take: 5,
      orderBy: { fecha_entrada: 'desc' },
      include: {
        materiales: { select: { nombre: true } },
        proveedores: { select: { nombre_empresa: true } },
      },
    })

    const salidasRecientes = await prisma.salidasmaterial.findMany({
      take: 5,
      orderBy: { fecha_salida: 'desc' },
      include: {
        materiales: { select: { nombre: true } },
      },
    })

    // Top 5 materiales por valor en stock
    const topMaterialesPorValor = await prisma.materiales.findMany({
      select: {
        id_material: true,
        nombre: true,
        stock_actual: true,
        precio_unitario: true,
        unidad_medida: true,
      },
      orderBy: {
        stock_actual: 'desc',
      },
      take: 10,
    })

    const topValor = topMaterialesPorValor
      .map((mat) => ({
        ...mat,
        valor_total: mat.stock_actual * Number(mat.precio_unitario),
      }))
      .sort((a, b) => b.valor_total - a.valor_total)
      .slice(0, 5)

    return NextResponse.json({
      estadisticas_generales: {
        total_materiales: totalMateriales,
        total_entradas: totalEntradas,
        total_salidas: totalSalidas,
        total_proveedores: totalProveedores,
        valor_total_inventario: valorTotal.toFixed(2),
      },
      stock_bajo: stockBajo,
      materiales_mas_utilizados: materialesUtilizadosConNombres,
      proveedores_frecuentes: proveedoresConNombres.filter((p) => p !== null),
      movimientos_recientes: {
        entradas: entradasRecientes,
        salidas: salidasRecientes,
      },
      top_materiales_por_valor: topValor,
    })
  } catch (error) {
    console.error('Error al obtener reportes:', error)
    return NextResponse.json({ error: 'Error al generar reportes' }, { status: 500 })
  }
}

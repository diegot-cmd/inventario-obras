# Resumen del Proyecto: Sistema de Inventario para Obras de Construcción

## Objetivo
Sistema web para la gestión de inventario de materiales en obras de construcción, permitiendo registrar, controlar y dar seguimiento a entradas y salidas de materiales, así como la gestión de proveedores y control de stock.

## Tecnologías principales
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- MySQL/MariaDB
- Tailwind CSS

## Estructura general
- **Frontend:**
  - Formularios y tablas para CRUD de materiales, entradas, salidas y proveedores.
  - Validación de datos en frontend y backend.
  - Navegación y componentes reutilizables (ej: Botón Volver).
- **Backend (API):**
  - Rutas API para materiales, entradas, salidas y proveedores.
  - Uso de Prisma para acceso a base de datos y modelos relacionales.
- **Base de datos:**
  - Modelos: `materiales`, `entradasmaterial`, `salidasmaterial`, `proveedores`.
  - Relaciones entre materiales, entradas, salidas y proveedores.

## Funcionalidades principales
- CRUD de materiales (nombre, descripción, unidad, precio, stock, fecha).
- Registro de entradas (con proveedor y fecha).
- Registro de salidas (con destino y fecha).
- Listados y búsqueda de materiales, entradas, salidas y proveedores.
- Control automático de stock.
- Interfaz amigable y responsiva.

## Archivos y carpetas clave
- `/src/app/materiales/` : Páginas y formularios para materiales, entradas, salidas y proveedores.
- `/src/app/api/` : Endpoints para operaciones CRUD.
- `/prisma/schema.prisma` : Definición de modelos y relaciones de la base de datos.
- `/src/app/components/` : Componentes reutilizables (formularios, botones, etc).
- `/public/` : Recursos estáticos (imágenes, íconos).

## Ejemplo de modelos (Prisma)
```prisma
model materiales {
  id_material      Int                @id @default(autoincrement())
  nombre           String
  descripcion      String?
  unidad_medida    String
  precio_unitario  Decimal
  stock_actual     Int                @default(0)
  fecha_registro   DateTime?
  entradasmaterial entradasmaterial[]
  salidasmaterial  salidasmaterial[]
}

model entradasmaterial {
  id_entrada    Int          @id @default(autoincrement())
  id_material   Int
  cantidad      Int
  id_proveedor  Int?
  fecha_entrada DateTime?
  materiales    materiales @relation(fields: [id_material], references: [id_material])
  proveedores   proveedores? @relation(fields: [id_proveedor], references: [id_proveedor])
}

model salidasmaterial {
  id_salida    Int        @id @default(autoincrement())
  id_material  Int
  cantidad     Int
  destino      String?
  fecha_salida DateTime?
  materiales    materiales @relation(fields: [id_material], references: [id_material])
}

model proveedores {
  id_proveedor     Int     @id @default(autoincrement())
  nombre_empresa   String
  contacto         String?
  telefono         String?
  email            String?
  direccion        String?
  entradasmaterial entradasmaterial[]
}
```

## Notas adicionales
- El proyecto está preparado para despliegue local y puede adaptarse a producción.
- El control de stock se actualiza automáticamente con cada entrada o salida.
- El código está modularizado y documentado para facilitar mantenimiento y escalabilidad.

---
Última actualización: Julio 2025

# Sistema de Inventario para Obras de Construcción

Este proyecto es una aplicación web para la gestión de inventario de materiales en obras de construcción, desarrollada para la empresa **C.E.P.A &**.

## 🚧 Estado actual
- CRUD completo de materiales, entradas, salidas y proveedores
- Control automático de stock
- Validación de datos en frontend y backend
- Interfaz responsiva y moderna con Tailwind CSS
- Navegación y componentes reutilizables
- Base de datos relacional con Prisma y MySQL/MariaDB

## Tecnologías principales
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- MySQL/MariaDB
- Tailwind CSS

## Estructura del proyecto
- `/src/app/materiales/` : Páginas y formularios para materiales, entradas, salidas y proveedores
- `/src/app/api/` : Endpoints para operaciones CRUD
- `/prisma/schema.prisma` : Modelos y relaciones de la base de datos
- `/src/app/components/` : Componentes reutilizables
- `/public/` : Recursos estáticos

## Funcionalidades principales
- Registro, edición y eliminación de materiales
- Registro de entradas (con proveedor y fecha)
- Registro de salidas (con destino y fecha)
- Listados y búsqueda de materiales, entradas, salidas y proveedores
- Control automático de stock

## Modelos principales (Prisma)
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

## Instalación y uso
1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura la base de datos en `.env`
4. Ejecuta migraciones Prisma: `npx prisma migrate dev`
5. Inicia el servidor: `npm run dev`

---
Última actualización: Julio 2025


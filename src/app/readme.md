# Sistema de Inventario para el Control de Materiales en Obras de Construcción

Este proyecto consiste en el desarrollo de un sistema web que permite gestionar el inventario de materiales en obras de construcción para la empresa **C.E.P.A &**.

## 🏗️ Objetivo

Facilitar el registro, control y seguimiento de entradas y salidas de materiales de construcción, mejorando la eficiencia y reduciendo pérdidas por falta de control.

## 🔧 Tecnologías utilizadas

- **Next.js 14 (App Router)**
- **TypeScript**
- **Prisma ORM**
- **MySQL/MariaDB**
- **Tailwind CSS**
- **XAMPP para entorno local**
- **Visual Studio Code**

## 🧩 Funcionalidades principales

- CRUD de materiales (Crear, Leer, Actualizar, Eliminar).
- Registro de entradas y salidas de materiales.
- Asignación de proveedor a cada entrada.
- Control de stock automático.
- Validación de datos desde el frontend y backend.
- Formulario de ingreso manual con campos como:
  - Nombre del material
  - Descripción
  - Unidad de medida
  - Precio unitario
  - Stock actual
  - Fecha de registro

## 📁 Estructura del proyecto

/app
/api
/materiales
route.ts (GET, POST)
/materiales/[id]
route.ts (GET, PUT, DELETE)
/materiales
page.tsx (Interfaz principal)

/lib
db.ts (Conexión Prisma con base de datos)

prisma/
schema.prisma (Esquema del modelo de datos)

public/
README.md
package.json
tsconfig.json
tailwind.config.ts

markdown
Copiar
Editar

## 🛠️ Requisitos previos

- Tener instalado:
  - Node.js
  - Git
  - XAMPP (con MySQL corriendo en el puerto 3306)
  - Prisma (`npm install prisma --save-dev`)
  - Cliente MySQL (como phpMyAdmin o TablePlus)

## 🚀 Instrucciones para ejecutar localmente

```bash
# Instalar dependencias
npm install

# Migrar la base de datos
npx prisma migrate dev

# Levantar el servidor
npm run dev
# Generar Prisma Client
npx prisma generate

# Ver el modelo en una interfaz
npx prisma studio
📝 Autor
Diego Ricardo Torres Campos
Correo: dtorresca@autonoma.edu.pe
Proyecto desarrollado como parte de las prácticas preprofesionales.

---

### ✅ 3. Agregar y hacer commit del README.md

```bash
git add README.md
git commit -m "Agregar README.md con la información del proyecto"
git push

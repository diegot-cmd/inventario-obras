# Documentación del Sistema de Inventario para Obras de Construcción

## 1. Descripción General
Sistema web para gestionar materiales, entradas, salidas y proveedores en obras de construcción. Permite registrar, consultar y editar información, con control automático de stock.

## 2. Instalación y Configuración
- Clona el repositorio.
- Instala dependencias: `npm install`
- Configura la base de datos en `.env`
- Ejecuta migraciones Prisma: `npx prisma migrate dev`
- Inicia el servidor: `npm run dev`

## 3. Estructura del Proyecto
- `/src/app/materiales/`: Páginas y formularios para materiales, entradas, salidas y proveedores.
- `/src/app/api/`: Endpoints para operaciones CRUD.
- `/prisma/schema.prisma`: Modelos y relaciones de la base de datos.
- `/src/app/components/`: Componentes reutilizables.
- `/public/`: Recursos estáticos.

## 4. Principales Funcionalidades
- CRUD de materiales, entradas, salidas y proveedores.
- Control automático de stock.
- Validación de datos en frontend y backend.
- Interfaz responsiva y moderna.
- Navegación intuitiva.

## 5. Modelos de Base de Datos
Incluye modelos para materiales, entradas, salidas y proveedores, con relaciones entre ellos. (Ver ejemplo en `resumen.md`).

## 6. API Endpoints
- `/api/materiales`: GET, POST, PUT, DELETE
- `/api/entradas`: GET, POST
- `/api/salidas`: GET, POST
- `/api/proveedores`: GET, POST, PUT, DELETE

## 7. Componentes Reutilizables
- Botón Volver
- Formularios de registro y edición
- Tablas de listado

## 8. Seguridad y Validaciones
- Validación de datos obligatorios en frontend y backend.
- Manejo de errores y mensajes al usuario.

## 9. Despliegue
- Preparado para entorno local y adaptable a producción.
- Requiere base de datos MySQL/MariaDB.

## 10. Mantenimiento y Escalabilidad
- Código modular y documentado.
- Fácil de extender para nuevas funcionalidades.

---
Última actualización: Julio 2025

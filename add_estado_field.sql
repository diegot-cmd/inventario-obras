-- Script SQL para agregar el campo estado sin perder datos existentes
-- Ejecutar este SQL en tu base de datos MySQL

-- Agregar columna estado con valor por defecto 'aprobado' para usuarios existentes
ALTER TABLE usuario ADD COLUMN estado VARCHAR(20) DEFAULT 'aprobado' AFTER role;

-- Los usuarios existentes quedarán como 'aprobado' automáticamente
-- Los nuevos usuarios se registrarán como 'pendiente' desde el código

-- Verificar que se agregó correctamente
SELECT id_usuario, nombre, email, role, estado FROM usuario;

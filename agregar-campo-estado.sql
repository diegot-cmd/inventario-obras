-- ============================================
-- SCRIPT PARA AGREGAR CAMPO ESTADO
-- Base de datos: inventario_obras
-- ============================================

USE inventario_obras;

-- Verificar si la columna ya existe
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'inventario_obras' 
  AND TABLE_NAME = 'usuario' 
  AND COLUMN_NAME = 'estado';

-- Si no existe, agregarla
SET @query = IF(@col_exists = 0,
    'ALTER TABLE usuario ADD COLUMN estado VARCHAR(20) DEFAULT ''aprobado'' AFTER role',
    'SELECT "La columna estado ya existe" AS mensaje'
);

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar el resultado
SELECT 'Campo estado agregado exitosamente' AS Resultado;

-- Mostrar estructura de la tabla
DESCRIBE usuario;

-- Mostrar usuarios actuales con su nuevo campo estado
SELECT id_usuario, nombre, email, role, estado, creado_en FROM usuario;

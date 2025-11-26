-- SQL para aprobar a los usuarios Admin existentes
-- Ejecuta esto en MariaDB para poder iniciar sesión

USE inventario_obras;

-- Aprobar todos los usuarios Admin
UPDATE usuario SET estado = 'aprobado' WHERE role = 'Admin';

-- Verificar el cambio
SELECT id_usuario, nombre, email, role, estado FROM usuario;

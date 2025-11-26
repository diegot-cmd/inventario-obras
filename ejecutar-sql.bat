@echo off
echo ========================================
echo   Ejecutar SQL - Sistema de Aprobacion
echo ========================================
echo.
echo Ejecutando SQL en la base de datos...
echo.

"C:\Program Files\MariaDB 11.7\bin\mysql.exe" -u root inventario_obras < add_estado_field.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] SQL ejecutado correctamente
    echo.
    echo Ahora ejecuta: npx prisma generate
    echo Y luego reinicia el servidor: npm run dev
) else (
    echo.
    echo [ERROR] No se pudo ejecutar el SQL
    echo.
    echo Opciones:
    echo 1. Abre HeidiSQL o phpMyAdmin
    echo 2. Conectate a la base de datos 'inventario_obras'
    echo 3. Ejecuta este SQL:
    echo.
    echo    ALTER TABLE usuario ADD COLUMN estado VARCHAR(20) DEFAULT 'aprobado' AFTER role;
    echo.
)

pause

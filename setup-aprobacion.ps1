# Script para completar la implementación del sistema de aprobación de usuarios
# Ejecutar este script desde PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sistema de Aprobación de Usuarios" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Mostrar SQL a ejecutar
Write-Host "PASO 1: Ejecutar SQL en la base de datos" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "Abre tu gestor de base de datos (HeidiSQL, phpMyAdmin, etc.) y ejecuta:" -ForegroundColor White
Write-Host ""
Write-Host "ALTER TABLE usuario ADD COLUMN estado VARCHAR(20) DEFAULT 'aprobado' AFTER role;" -ForegroundColor Green
Write-Host ""
Write-Host "O ejecuta manualmente:" -ForegroundColor White
Write-Host 'mysql -u root -p inventario_obras < add_estado_field.sql' -ForegroundColor Green
Write-Host ""
Read-Host "Presiona Enter cuando hayas ejecutado el SQL"

# Paso 2: Regenerar Prisma Client
Write-Host ""
Write-Host "PASO 2: Regenerando cliente de Prisma..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Cliente de Prisma regenerado correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al regenerar Prisma" -ForegroundColor Red
    exit 1
}

# Paso 3: Verificar archivos
Write-Host ""
Write-Host "PASO 3: Verificación de archivos..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

$archivos = @(
    "src\app\api\usuarios\cambiar-estado\route.ts",
    "src\app\api\auth\login\route.ts",
    "src\app\api\auth\register\route.ts",
    "src\app\usuarios\page.tsx"
)

foreach ($archivo in $archivos) {
    if (Test-Path $archivo) {
        Write-Host "✅ $archivo" -ForegroundColor Green
    } else {
        Write-Host "❌ $archivo NO ENCONTRADO" -ForegroundColor Red
    }
}

# Paso 4: Reiniciar servidor
Write-Host ""
Write-Host "PASO 4: Reiniciar el servidor de desarrollo" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host "Para que los cambios surtan efecto, reinicia el servidor:" -ForegroundColor White
Write-Host ""
Write-Host "1. Detén el servidor actual (Ctrl+C)" -ForegroundColor Cyan
Write-Host "2. Ejecuta: npm run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Implementación completada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Funcionalidades implementadas:" -ForegroundColor White
Write-Host "• Usuarios nuevos se registran con estado 'pendiente'" -ForegroundColor Gray
Write-Host "• Solo Admin puede aprobar/rechazar usuarios" -ForegroundColor Gray
Write-Host "• Usuarios no aprobados no pueden iniciar sesión" -ForegroundColor Gray
Write-Host "• Interfaz con botones de aprobación en /usuarios" -ForegroundColor Gray
Write-Host ""

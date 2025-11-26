# 🧪 Pruebas Unitarias - Sistema de Inventario de Obras

Esta carpeta contiene todas las pruebas unitarias del sistema de gestión de inventario.

## 📁 Estructura

```
__tests__/
├── api/
│   ├── auth/
│   │   ├── login.test.ts          # Pruebas de inicio de sesión
│   │   └── register.test.ts       # Pruebas de registro de usuarios
│   ├── materiales/
│   │   └── materiales.test.ts     # Pruebas CRUD de materiales
│   ├── proveedores/
│   │   └── proveedores.test.ts    # Pruebas CRUD de proveedores
│   └── usuarios/
│       └── usuarios.test.ts       # Pruebas CRUD de usuarios y aprobación
```

## 🚀 Ejecutar Pruebas

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar pruebas en modo watch (desarrollo)
```bash
npm run test:watch
```

### Ejecutar pruebas con cobertura
```bash
npm run test:coverage
```

### Ejecutar un archivo de prueba específico
```bash
npm test -- login.test.ts
```

## 📊 Cobertura de Pruebas

Las pruebas cubren los siguientes módulos:

### ✅ Autenticación (auth)
- Login con validación de credenciales
- Validación de estado de usuario (pendiente/aprobado)
- Registro de nuevos usuarios
- Validación de email duplicado

### ✅ Materiales CRUD
- Listar todos los materiales
- Crear nuevo material
- Actualizar material existente
- Eliminar material
- Validación de campos requeridos

### ✅ Proveedores CRUD
- Listar todos los proveedores
- Crear nuevo proveedor
- Actualizar proveedor existente
- Eliminar proveedor
- Validación de campos requeridos

### ✅ Usuarios CRUD
- Listar todos los usuarios
- Actualizar información de usuario
- Eliminar usuario
- Cambiar estado (aprobar/rechazar)
- Validación de estados válidos

## 🛠️ Tecnologías

- **Jest**: Framework de testing
- **@testing-library/react**: Testing de componentes React
- **@testing-library/jest-dom**: Matchers personalizados para el DOM
- **@testing-library/user-event**: Simulación de eventos de usuario

## 📝 Convenciones

1. Los archivos de prueba deben tener la extensión `.test.ts` o `.test.tsx`
2. Los mocks de Prisma se definen al inicio de cada archivo
3. Se usa `beforeEach` para limpiar los mocks entre pruebas
4. Cada describe agrupa pruebas relacionadas por funcionalidad
5. Los nombres de las pruebas deben describir claramente qué se está probando

## 🔍 Ejemplo de Prueba

```typescript
describe('API - Login', () => {
  it('debería retornar error si falta el email', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: '123456' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email y contraseña son requeridos');
  });
});
```

## 📈 Mejoras Futuras

- [ ] Agregar pruebas de integración
- [ ] Agregar pruebas E2E con Playwright
- [ ] Aumentar cobertura a más del 80%
- [ ] Agregar pruebas de performance
- [ ] Agregar pruebas de seguridad

## 👥 Contribuir

Para agregar nuevas pruebas:

1. Crea un nuevo archivo en la carpeta correspondiente
2. Importa los módulos necesarios
3. Define los mocks de Prisma
4. Escribe las pruebas usando `describe` e `it`
5. Ejecuta las pruebas para verificar que pasen
6. Actualiza este README si es necesario

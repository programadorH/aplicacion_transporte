# Empresa de Transporte - Bootstrap + Node.js + MySQL

Esta versión toma como base las tablas de la imagen:

- clientes
- envios
- asesores

Además agrega `usuarios` porque la aplicación necesita registro e inicio de sesión.

## Arquitectura

```text
Navegador
   │
   │ fetch()
   ▼
Frontend HTML + Bootstrap + JS
   │
   │ HTTP
   ▼
Node.js + Express
   │
   │ SQL
   ▼
MySQL
```

## 1. Crear la base de datos

Abre MySQL Workbench o MySQL Shell y ejecuta todo el archivo:

`database.sql`

Esto crea:

`empresa_transporte`

y las tablas:

- usuarios
- clientes
- envios
- asesores

También inserta los registros de ejemplo de la imagen.

## 2. Configurar conexión

Copia:

`.env.example`

como:

`.env`

y configura:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_CLAVE
DB_NAME=empresa_transporte
```

## 3. Instalar dependencias

Desde la carpeta `backend`:

```bash
npm install
```

## 4. Ejecutar API

```bash
npm start
```

Debe aparecer:

```text
API ejecutándose en http://localhost:3000
```

Prueba:

```text
http://localhost:3000/api/health
```

## 5. Abrir frontend

Abre `frontend/index.html`.

La interfaz consulta la API y muestra los registros que están realmente en MySQL.

## Qué ya funciona

- Registro de usuarios.
- Inicio de sesión.
- Consulta de clientes desde MySQL.
- Consulta de envíos desde MySQL.
- Consulta de asesores desde MySQL.
- Crear clientes desde la aplicación.
- Crear envíos desde la aplicación.
- Panel con conteos de registros.
- Modo claro/oscuro.
- Botón de WhatsApp.

## Importante

`localStorage` ya no es la fuente principal de los registros empresariales.

Los clientes, envíos y asesores se consultan desde MySQL mediante la API.

Para producción todavía faltaría agregar autenticación con JWT/sesiones, permisos por rol, validaciones más completas, actualización/eliminación de registros y HTTPS.

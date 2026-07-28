# Earned Value — Backend

API REST para gestión de proyectos, actividades y autenticación de usuarios. Construido con **Node.js**, **Express**, **TypeScript**, **Sequelize** y **PostgreSQL**.

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Docker](https://www.docker.com/) y Docker Compose
- npm

## Pasos para levantar el backend

### 1. Clonar el repositorio e ingresar al backend

```bash
git clone <url-del-repositorio>
cd "Proyect trycore/EarnedValue-Backend"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edita los valores según tu entorno:

```bash
cp .env.example .env
```

Variables requeridas en `.env`:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor Express | `3000` |
| `DB_NAME` | Nombre de la base de datos | `EarnedValueDB` |
| `DB_USERNAME` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `EarnedValue123` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `JWTKEYSECRET` | Secreto para firmar tokens JWT | `mi_secreto_seguro` |

> **Importante:** `DB_NAME` y `DB_PASSWORD` deben coincidir con los valores que usa Docker Compose.

### 4. Levantar PostgreSQL con Docker

Desde la carpeta `EarnedValue-Backend`:

```bash
docker compose up -d
```

Esto crea un contenedor PostgreSQL 14 en el puerto `5432`. Los datos persisten en la carpeta local `postgres/` (ignorada por Git).

Verificar que el contenedor esté corriendo:

```bash
docker compose ps
```

### 5. Iniciar el servidor

```bash
npm start
```

El servidor usa **nodemon** + **ts-node** y recarga automáticamente al editar archivos en `src/`.

Al arrancar correctamente verás:

```
Estamos conectando a la base de datos
Base de datos conectada exitosamente
Levantando rutas...
Conexion Exitosa por el puerto: 3000
Documentacion Swagger: http://localhost:3000/api-docs
```

Sequelize sincroniza las tablas automáticamente al iniciar (`connection.sync({ alter: true })`), por lo que **no necesitas ejecutar scripts SQL manualmente**.

### 6. Verificar que funciona

- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **OpenAPI JSON:** [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

## Documentación del API (Swagger)

La especificación OpenAPI está disponible en:

| Recurso | URL |
|---|---|
| Interfaz Swagger UI | `http://localhost:3000/api-docs` |
| Especificación JSON | `http://localhost:3000/api-docs.json` |

### Endpoints disponibles

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/earnedValue/auth/register` | No | Registrar usuario |
| `POST` | `/earnedValue/auth/login` | No | Iniciar sesión |
| `GET` | `/earnedValue/auth/validator` | Bearer | Validar sesión |
| `POST` | `/earnedValue/project/create` | Bearer | Crear proyecto |
| `GET` | `/earnedValue/project/list` | Bearer | Listar proyectos |
| `GET` | `/earnedValue/project/:id` | Bearer | Obtener proyecto |
| `PATCH` | `/earnedValue/project/edit/:id` | Bearer | Editar proyecto |
| `DELETE` | `/earnedValue/project/delete/:id` | Bearer | Eliminar proyecto |
| `POST` | `/earnedValue/activities/create/:id_project` | Bearer | Crear actividad |
| `GET` | `/earnedValue/activities/list/:id_project` | Bearer | Listar actividades |
| `GET` | `/earnedValue/activities/:id` | Bearer | Obtener actividad |
| `PATCH` | `/earnedValue/activities/edit/:id` | Bearer | Editar actividad |
| `DELETE` | `/earnedValue/activities/delete/:id` | Bearer | Eliminar actividad |

### Autenticación

Los endpoints protegidos requieren el header:

```
Authorization: Bearer <token_jwt>
```

Obtén el token registrándote o iniciando sesión en `/earnedValue/auth/register` o `/earnedValue/auth/login`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor en modo desarrollo (nodemon) |
| `npm test` | Ejecuta tests con Jest en modo watch |
| `npm run test:run` | Ejecuta tests una sola vez |
| `npm run test:coverage` | Ejecuta tests con reporte de cobertura (≥80%) |

## Estructura del proyecto

```
EarnedValue-Backend/
├── src/
│   ├── app.ts                 # Punto de entrada
│   ├── config/
│   │   ├── server.ts          # Configuración Express + Swagger
│   │   └── swagger.ts         # Especificación OpenAPI
│   ├── controller/            # Lógica de endpoints
│   ├── db/db.ts               # Conexión Sequelize
│   ├── interfaces/dtos/       # Tipos TypeScript
│   ├── middleware/            # JWT create/validate
│   ├── models/                # Modelos Sequelize
│   └── router/                # Rutas + anotaciones Swagger
├── docker-compose.yml         # PostgreSQL local
├── .env.example               # Variables de entorno de referencia
└── jest.config.js             # Configuración de pruebas
```

## Detener servicios

```bash
# Detener el servidor: Ctrl + C en la terminal

# Detener PostgreSQL
docker compose down
```

## Solución de problemas

| Problema | Solución |
|---|---|
| `Error al conectar a la base de datos` | Verifica que Docker esté corriendo (`docker compose ps`) y que las variables en `.env` coincidan con `docker-compose.yml`. |
| `Token no proporcionado o formato inválido` | Envía el header `Authorization: Bearer <token>`. |
| Puerto 3000 en uso | Cambia `PORT` en `.env` o detén el proceso que lo usa. |
| Puerto 5432 en uso | Detén otras instancias de PostgreSQL o cambia `DB_PORT` en `.env` y el mapeo en `docker-compose.yml`. |

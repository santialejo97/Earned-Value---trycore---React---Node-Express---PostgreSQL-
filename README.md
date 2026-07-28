# Earned Value Management — Trycore Colombia

Aplicación fullstack para que líderes de proyecto registren el avance de sus actividades y analicen el estado del proyecto en términos de cronograma y presupuesto usando la metodología **Earned Value Management (EVM)**.

## Estructura del repositorio

```
Proyect trycore/
├── EarnedValue-Backend/     # API REST — Node.js + Express + PostgreSQL
├── EarnedVelue-Frontend/    # Dashboard — React + TypeScript + Vite
├── AI_PROCESS.md            # Documento de proceso con IA (entrega Trycore)
└── README.md                # Este archivo
```

## Requisitos previos

- Node.js v18+
- Docker y Docker Compose
- npm

## Inicio rápido

### 1. Backend

```bash
cd EarnedValue-Backend
npm install
cp .env.example .env        # Editar con tus valores
docker compose up -d        # Levantar PostgreSQL
npm start                   # Servidor en http://localhost:3000
```

Documentación completa del backend: [EarnedValue-Backend/README.md](./EarnedValue-Backend/README.md)

- **Swagger UI:** http://localhost:3000/api-docs
- **OpenAPI JSON:** http://localhost:3000/api-docs.json

### 2. Frontend

```bash
cd EarnedVelue-Frontend
npm install
cp .env.example .env        # Editar VITE_API_URL si es necesario
npm run dev                 # App en http://localhost:5173
```

Variable de entorno del frontend:

```env
VITE_API_URL=http://localhost:3000/earnedValue
```

## Stack tecnológico

| Capa | Tecnologías |
|---|---|
| Backend | Node.js, Express 5, TypeScript, Sequelize, PostgreSQL, JWT, Swagger |
| Frontend | React 19, TypeScript, Vite, TanStack Query, Zustand, Tailwind CSS, shadcn/ui |
| Pruebas | Jest (backend), Vitest (frontend) — cobertura ≥80% |
| Base de datos | PostgreSQL 14 (Docker) |

## Indicadores EVM

Los indicadores se calculan en el frontend a partir de los datos de las actividades:

| Indicador | Fórmula |
|---|---|
| PV — Planned Value | % planificado × BAC |
| EV — Earned Value | % completado × BAC |
| CV — Cost Variance | EV − AC |
| SV — Schedule Variance | EV − PV |
| CPI — Cost Performance Index | EV / AC |
| SPI — Schedule Performance Index | EV / PV |
| EAC — Estimate at Completion | BAC / CPI |
| VAC — Variance at Completion | BAC − EAC |

## Pruebas

```bash
# Backend
cd EarnedValue-Backend
npm run test:coverage

# Frontend
cd EarnedVelue-Frontend
npm run test:coverage
```

## Gitflow

```
main (master)  ← producción
develop        ← integración
feature/*      ← funcionalidades
release        ← pre-producción
```

## Entregables Trycore

1. Repositorio en GitHub con historial de commits
2. [AI_PROCESS.md](./AI_PROCESS.md) — documento de proceso con IA
3. Video de presentación (máx. 10 minutos)

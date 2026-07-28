import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Earned Value API",
    version: "1.0.0",
    description:
      "API REST para gestión de proyectos, actividades y autenticación de usuarios. " +
      "Los indicadores de Valor Ganado (EVM) se calculan en el frontend a partir de los datos de las actividades.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de desarrollo local",
    },
  ],
  tags: [
    { name: "Auth", description: "Registro, login y validación de sesión" },
    { name: "Projects", description: "CRUD de proyectos" },
    { name: "Activities", description: "CRUD de actividades por proyecto" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT obtenido en login o register",
      },
    },
    schemas: {
      Status: {
        type: "string",
        enum: ["pending", "in_progress", "completed", "delete"],
        example: "pending",
      },
      ErrorResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: false },
          msg: { type: "string", example: "Descripción del error" },
        },
      },
      User: {
        type: "object",
        properties: {
          id_user: { type: "string", format: "uuid" },
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", format: "email", example: "juan@example.com" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Proyecto Alpha" },
          description: { type: "string", example: "Implementación del módulo EVM" },
          status: { $ref: "#/components/schemas/Status" },
          id_user: { type: "string", format: "uuid" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Activity: {
        type: "object",
        properties: {
          id_activity: { type: "string", format: "uuid" },
          name: { type: "string", example: "Diseño de arquitectura" },
          description: { type: "string", example: "Definir componentes del sistema" },
          budgetCompletion: {
            type: "number",
            format: "float",
            description: "BAC — presupuesto total planificado",
            example: 5000,
          },
          percentagePlanned: {
            type: "number",
            format: "float",
            description: "Porcentaje de avance planificado a la fecha de corte",
            example: 60,
          },
          percentageCompleted: {
            type: "number",
            format: "float",
            description: "Porcentaje de avance real completado",
            example: 45,
          },
          actualCost: {
            type: "number",
            format: "float",
            description: "AC — costo real incurrido",
            example: 2800,
          },
          status: { $ref: "#/components/schemas/Status" },
          startDate: {
            type: "integer",
            format: "int64",
            description: "Fecha de inicio en timestamp (milisegundos)",
            example: 1704067200000,
          },
          endDate: {
            type: "integer",
            format: "int64",
            description: "Fecha de fin en timestamp (milisegundos)",
            example: 1711929600000,
          },
          id_project: { type: "string", format: "uuid" },
          id_user: { type: "string", format: "uuid" },
          id_user_update: { type: "string", format: "uuid" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "juan@example.com" },
          password: { type: "string", format: "password", example: "MiClave123" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", format: "email", example: "juan@example.com" },
          password: { type: "string", format: "password", example: "MiClave123" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: true },
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        },
      },
      ProjectCreateRequest: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string", example: "Proyecto Alpha" },
          description: { type: "string", example: "Implementación del módulo EVM" },
          status: { $ref: "#/components/schemas/Status" },
        },
      },
      ProjectResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: true },
          msg: { type: "string" },
          project: { $ref: "#/components/schemas/Project" },
        },
      },
      ProjectListResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: true },
          projects: {
            type: "array",
            items: { $ref: "#/components/schemas/Project" },
          },
        },
      },
      ActivityCreateRequest: {
        type: "object",
        required: [
          "name",
          "description",
          "budgetCompletion",
          "percentagePlanned",
          "startDate",
          "endDate",
        ],
        properties: {
          name: { type: "string", example: "Diseño de arquitectura" },
          description: { type: "string", example: "Definir componentes del sistema" },
          budgetCompletion: { type: "number", example: 5000 },
          percentagePlanned: { type: "number", example: 60 },
          percentageCompleted: { type: "number", example: 0 },
          actualCost: { type: "number", example: 0 },
          status: { $ref: "#/components/schemas/Status" },
          startDate: { type: "integer", format: "int64", example: 1704067200000 },
          endDate: { type: "integer", format: "int64", example: 1711929600000 },
        },
      },
      ActivityResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: true },
          msg: { type: "string" },
          activity: { $ref: "#/components/schemas/Activity" },
        },
      },
      ActivityListResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: true },
          activities: {
            type: "array",
            items: { $ref: "#/components/schemas/Activity" },
          },
        },
      },
      SuccessMessageResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: true },
          msg: { type: "string" },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: ["./src/router/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

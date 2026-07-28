import { Router } from "express";
import { validatorJwt } from "../middleware";
import {
  projectById,
  projectCreate,
  projectDelete,
  projectEdit,
  projectList,
} from "../controller";

export const projectRouter = Router();

/**
 * @swagger
 * /earnedValue/project/create:
 *   post:
 *     summary: Crear proyecto
 *     description: Crea un nuevo proyecto asociado al usuario autenticado.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreateRequest'
 *     responses:
 *       200:
 *         description: Proyecto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
projectRouter.post("/create", validatorJwt, projectCreate);

/**
 * @swagger
 * /earnedValue/project/edit/{id}:
 *   patch:
 *     summary: Editar proyecto
 *     description: Actualiza los datos de un proyecto existente. Solo el propietario puede editarlo.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreateRequest'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       404:
 *         description: Proyecto no encontrado o no pertenece al usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
projectRouter.patch("/edit/:id", validatorJwt, projectEdit);

/**
 * @swagger
 * /earnedValue/project/delete/{id}:
 *   delete:
 *     summary: Eliminar proyecto
 *     description: Elimina lógicamente un proyecto (soft delete). Cambia el status a delete y registra deleted_at.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
projectRouter.delete("/delete/:id", validatorJwt, projectDelete);

/**
 * @swagger
 * /earnedValue/project/list:
 *   get:
 *     summary: Listar proyectos
 *     description: Retorna todos los proyectos del sistema para el usuario autenticado.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectListResponse'
 *       404:
 *         description: No existen proyectos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
projectRouter.get("/list", validatorJwt, projectList);

/**
 * @swagger
 * /earnedValue/project/{id}:
 *   get:
 *     summary: Obtener proyecto por ID
 *     description: Retorna el detalle de un proyecto específico.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       404:
 *         description: Proyecto no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
projectRouter.get("/:id", validatorJwt, projectById);

import { Router } from "express";
import { validatorJwt } from "../middleware";
import {
  activitieDelete,
  activitieEdit,
  activitiesById,
  activitiesList,
  createActivitie,
} from "../controller";

export const activitiesRouter = Router();

/**
 * @swagger
 * /earnedValue/activities/create/{id_project}:
 *   post:
 *     summary: Crear actividad
 *     description: |
 *       Crea una actividad dentro de un proyecto. Las fechas deben enviarse como timestamp en milisegundos.
 *       Los campos budgetCompletion, percentagePlanned, percentageCompleted y actualCost son la base
 *       para calcular los indicadores EVM (PV, EV, AC, CPI, SPI, etc.) en el frontend.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_project
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proyecto al que pertenece la actividad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivityCreateRequest'
 *     responses:
 *       200:
 *         description: Actividad creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityResponse'
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
activitiesRouter.post("/create/:id_project", validatorJwt, createActivitie);

/**
 * @swagger
 * /earnedValue/activities/edit/{id}:
 *   patch:
 *     summary: Editar actividad
 *     description: Actualiza los datos de una actividad existente. Las fechas se envían como timestamp en milisegundos.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la actividad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivityCreateRequest'
 *     responses:
 *       200:
 *         description: Actividad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityResponse'
 *       404:
 *         description: Actividad no encontrada
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
activitiesRouter.patch("/edit/:id", validatorJwt, activitieEdit);

/**
 * @swagger
 * /earnedValue/activities/list/{id_project}:
 *   get:
 *     summary: Listar actividades por proyecto
 *     description: Retorna todas las actividades asociadas a un proyecto.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_project
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Lista de actividades
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityListResponse'
 *       404:
 *         description: No existen actividades para el proyecto
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
activitiesRouter.get("/list/:id_project", validatorJwt, activitiesList);

/**
 * @swagger
 * /earnedValue/activities/{id}:
 *   get:
 *     summary: Obtener actividad por ID
 *     description: Retorna el detalle de una actividad específica.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Actividad encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityResponse'
 *       404:
 *         description: Actividad no existe
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
activitiesRouter.get("/:id", validatorJwt, activitiesById);

/**
 * @swagger
 * /earnedValue/activities/delete/{id}:
 *   delete:
 *     summary: Eliminar actividad
 *     description: Elimina lógicamente una actividad (soft delete). Cambia el status a delete y registra deleted_at.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Actividad eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *       404:
 *         description: Actividad no encontrada
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
activitiesRouter.delete("/delete/:id", validatorJwt, activitieDelete);

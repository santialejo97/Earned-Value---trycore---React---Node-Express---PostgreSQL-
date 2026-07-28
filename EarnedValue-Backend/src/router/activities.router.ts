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

activitiesRouter.post("/create/:id_project", validatorJwt, createActivitie);
activitiesRouter.patch("/edit/:id", validatorJwt, activitieEdit);
activitiesRouter.get("/list/:id_project", validatorJwt, activitiesList);
activitiesRouter.get("/:id", validatorJwt, activitiesById);
activitiesRouter.delete("/delete/:id", validatorJwt, activitieDelete);

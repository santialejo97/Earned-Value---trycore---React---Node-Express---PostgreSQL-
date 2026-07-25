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

projectRouter.post("/create", validatorJwt, projectCreate);
projectRouter.patch("/edit/:id", validatorJwt, projectEdit);
projectRouter.delete("/delete/:id", validatorJwt, projectDelete);
projectRouter.get("/list", validatorJwt, projectList);
projectRouter.get("/:id", validatorJwt, projectById);

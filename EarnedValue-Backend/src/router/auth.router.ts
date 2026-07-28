import { Router } from "express";
import { validatorJwt } from "../middleware";
import { authLogin, authRegister, authValidator } from "../controller";

export const routerAuth = Router();

//TODO Implementar class-validator

routerAuth.post("/login", authLogin);
routerAuth.post("/register", authRegister);
routerAuth.get("/validator", validatorJwt, authValidator);

import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { connection } from "../db/db";
import { routerAuth, projectRouter, activitiesRouter } from "../router";
import { swaggerSpec } from "./swagger";
import cors from "cors";
import colors from "colors";
import "../models";

class Server {
  private app: Application;
  private port: string;
  private path = {
    auth: "/earnedValue/auth",
    project: "/earnedValue/project",
    activities: "/earnedValue/activities",
  };

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.port = process.env.PORT || "3000";
    this.connectDataBase();
    this.router();
  }

  async connectDataBase() {
    try {
      console.log(colors.blue(`Estamos conectando a la base de datos`));
      await connection.authenticate();
      await connection.sync({ alter: true });
      console.log(colors.green(`Base de datos conectada exitosamente`));
    } catch (error) {
      console.log(colors.red(`Error al conectar a la base de datos: ${error}`));
    }
  }

  router() {
    console.log(colors.blue(`Levantando rutas...`));

    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "Earned Value API Docs",
      }),
    );
    this.app.get("/api-docs.json", (_req, res) => {
      res.json(swaggerSpec);
    });

    this.app.use(this.path.auth, routerAuth);
    this.app.use(this.path.project, projectRouter);
    this.app.use(this.path.activities, activitiesRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(colors.green(`Conexion Exitosa por el puerto: ${this.port}`));
      console.log(
        colors.cyan(`Documentacion Swagger: http://localhost:${this.port}/api-docs`),
      );
    });
  }
}

export default Server;

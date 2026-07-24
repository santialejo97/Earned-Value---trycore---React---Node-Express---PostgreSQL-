import express, { Application } from "express";
import { connection } from "../db/db";
import colors from "colors";
import "../models/users.model";
import "../models/projects.model";
import "../models/activities.model";

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.port = process.env.PORT || "3000";
    this.connectDataBase();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(colors.green(`Conexion Exitosa por el puerto: ${this.port}`));
    });
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
}

export default Server;

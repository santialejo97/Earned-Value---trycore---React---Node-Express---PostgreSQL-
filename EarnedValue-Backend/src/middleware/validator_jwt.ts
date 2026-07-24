import { Request, Response, NextFunction } from "express";
import colors from "colors";
import { verify } from "jsonwebtoken";
import { User } from "../models";

export const validatorJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        msg: "Token no proporcionado o formato inválido.",
      });
    }

    const token = authHeader.split(" ")[1] || "";

    const payload = verify(token, process.env.JWTKEYSECRET || "") as {
      [key: string]: any;
    };

    const { uuid } = payload;

    const user = await User.findByPk(uuid);
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Unauthorized",
      });
    }

    (req as any).uuid = uuid;
    (req as any).user = user;

    next();
  } catch (error) {
    console.log(colors.red("Error validando el token del usuario"));
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: "Token inválido o expirado",
    });
  }
};

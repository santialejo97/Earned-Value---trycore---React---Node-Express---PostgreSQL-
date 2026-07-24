import { Request, Response } from "express";
import { User } from "../models";
import { createJwt } from "../middleware";
import * as bcrypt from "bcrypt";

export const authLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: `User with the email ${email} no found. `,
      });
    }

    const isValidPassword: boolean = bcrypt.compareSync(
      password,
      user.dataValues.password,
    );

    if (!isValidPassword) {
      return res.status(401).json({
        ok: false,
        msg: `email or password is incorrect`,
      });
    }

    const token: string = createJwt(email, user.dataValues.id_user);

    delete user.dataValues.password;

    return res.status(200).json({
      ok: true,
      user: user,
      token,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const authRegister = async (req: Request, res: Response) => {
  try {
    const { body } = req;

    const userRegister = await User.findOne({ where: { email: body.email } });

    if (userRegister) {
      return res.status(422).json({
        ok: false,
        msg: `User with the email ${body.email} it was found in the database, please validate information`,
      });
    }

    const passwordEncrypted: string = bcrypt.hashSync(
      body.password,
      bcrypt.genSaltSync(10),
    );

    body.password = passwordEncrypted;

    const newUser = await User.create(body);
    newUser.save();

    const { id_user, email } = newUser.dataValues;
    const token: string = createJwt(email, id_user);

    delete newUser.dataValues.password;
    return res.json({
      ok: true,
      user: newUser,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const authValidator = (req: Request, res: Response) => {
  try {
    const uuid = (req as any).uuid;
    const user = (req as any).user;

    delete user?.dataValues?.password;

    const { email } = user;

    const token: string = createJwt(email, uuid);

    return res.status(200).json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

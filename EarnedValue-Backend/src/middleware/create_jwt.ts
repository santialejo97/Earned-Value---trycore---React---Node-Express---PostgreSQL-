import { sign } from "jsonwebtoken";

export const createJwt = (email: string, uuid: string) => {
  const payload: { email: string; uuid: string } = {
    email,
    uuid,
  };

  const token: string = sign(payload, process.env.JWTKEYSECRET || "", {
    expiresIn: "2h",
  });

  return token;
};

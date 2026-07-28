import { verify } from "jsonwebtoken";
import { User } from "../models";
import { validatorJwt } from "./validator_jwt";
import {
  createMockNext,
  createMockRequest,
  createMockResponse,
} from "../test/test-utils";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe("validatorJwt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rechaza petición sin header Authorization", async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    await validatorJwt(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      msg: "Token no proporcionado o formato inválido.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rechaza header con formato inválido", async () => {
    const req = createMockRequest({
      headers: { authorization: "Token invalid-format" },
    });
    const res = createMockResponse();
    const next = createMockNext();

    await validatorJwt(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rechaza token inválido o expirado", async () => {
    jest.mocked(verify).mockImplementation(() => {
      throw new Error("invalid token");
    });

    const req = createMockRequest({
      headers: { authorization: "Bearer bad-token" },
    });
    const res = createMockResponse();
    const next = createMockNext();

    await validatorJwt(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      msg: "Token inválido o expirado",
    });
  });

  it("rechaza si el usuario no existe", async () => {
    jest.mocked(verify).mockReturnValue({ uuid: "missing-user" } as never);
    jest.mocked(User.findByPk).mockResolvedValue(null);

    const req = createMockRequest({
      headers: { authorization: "Bearer valid-token" },
    });
    const res = createMockResponse();
    const next = createMockNext();

    await validatorJwt(req, res, next);

    expect(User.findByPk).toHaveBeenCalledWith("missing-user");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      msg: "Unauthorized",
    });
  });

  it("adjunta uuid y usuario y continua", async () => {
    const mockUser = { id_user: "user-1", toJSON: () => ({ id_user: "user-1" }) };
    jest.mocked(verify).mockReturnValue({ uuid: "user-1" } as never);
    jest.mocked(User.findByPk).mockResolvedValue(mockUser as never);

    const req = createMockRequest({
      headers: { authorization: "Bearer valid-token" },
    });
    const res = createMockResponse();
    const next = createMockNext();

    await validatorJwt(req, res, next);

    expect((req as any).uuid).toBe("user-1");
    expect((req as any).user).toBe(mockUser);
    expect(next).toHaveBeenCalled();
  });
});

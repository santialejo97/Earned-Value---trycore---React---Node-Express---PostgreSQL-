import * as bcrypt from "bcrypt";
import { User } from "../models";
import { createJwt } from "../middleware";
import { authLogin, authRegister, authValidator } from "./auth.controller";
import { createMockRequest, createMockResponse } from "../test/test-utils";

jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../middleware", () => ({
  createJwt: jest.fn(() => "jwt-token"),
}));

jest.mock("bcrypt", () => ({
  compareSync: jest.fn(),
  hashSync: jest.fn(() => "hashed-password"),
  genSaltSync: jest.fn(() => "salt"),
}));

const mockUser = {
  id_user: "user-1",
  email: "test@example.com",
  name: "Test User",
  password: "hashed-password",
  toJSON: () => ({
    id_user: "user-1",
    email: "test@example.com",
    name: "Test User",
    password: "hashed-password",
  }),
};

describe("auth.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("authLogin", () => {
    it("retorna 400 si el usuario no existe", async () => {
      jest.mocked(User.findOne).mockResolvedValue(null);
      const req = createMockRequest({
        body: { email: "missing@example.com", password: "secret" },
      });
      const res = createMockResponse();

      await authLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ ok: false }),
      );
    });

    it("retorna 401 si la contraseña es incorrecta", async () => {
      jest.mocked(User.findOne).mockResolvedValue(mockUser as never);
      jest.mocked(bcrypt.compareSync).mockReturnValue(false);

      const req = createMockRequest({
        body: { email: "test@example.com", password: "wrong" },
      });
      const res = createMockResponse();

      await authLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        ok: false,
        msg: "email or password is incorrect",
      });
    });

    it("autentica correctamente y retorna token", async () => {
      jest.mocked(User.findOne).mockResolvedValue(mockUser as never);
      jest.mocked(bcrypt.compareSync).mockReturnValue(true);

      const req = createMockRequest({
        body: { email: "test@example.com", password: "secret" },
      });
      const res = createMockResponse();

      await authLogin(req, res);

      expect(createJwt).toHaveBeenCalledWith("test@example.com", "user-1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          token: "jwt-token",
          user: expect.not.objectContaining({ password: expect.anything() }),
        }),
      );
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(User.findOne).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({
        body: { email: "test@example.com", password: "secret" },
      });
      const res = createMockResponse();

      await authLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("authRegister", () => {
    it("retorna 404 si el email ya existe", async () => {
      jest.mocked(User.findOne).mockResolvedValue(mockUser as never);
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          password: "secret",
          name: "Test",
        },
      });
      const res = createMockResponse();

      await authRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("registra usuario y retorna token", async () => {
      jest.mocked(User.findOne).mockResolvedValue(null);
      const createdUser = {
        ...mockUser,
        save: jest.fn(),
        toJSON: () => ({
          id_user: "user-1",
          email: "new@example.com",
          name: "New User",
          password: "hashed-password",
        }),
      };
      jest.mocked(User.create).mockResolvedValue(createdUser as never);

      const req = createMockRequest({
        body: {
          email: "new@example.com",
          password: "secret",
          name: "New User",
        },
      });
      const res = createMockResponse();

      await authRegister(req, res);

      expect(bcrypt.hashSync).toHaveBeenCalled();
      expect(createJwt).toHaveBeenCalledWith("new@example.com", "user-1");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ ok: true, token: "jwt-token" }),
      );
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(User.findOne).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({
        body: { email: "new@example.com", password: "secret", name: "New" },
      });
      const res = createMockResponse();

      await authRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("authValidator", () => {
    it("retorna usuario y nuevo token", () => {
      const req = createMockRequest();
      (req as any).uuid = "user-1";
      (req as any).user = mockUser;
      const res = createMockResponse();

      authValidator(req, res);

      expect(createJwt).toHaveBeenCalledWith("test@example.com", "user-1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          token: "jwt-token",
        }),
      );
    });

    it("retorna 500 ante error interno", () => {
      const req = createMockRequest();
      (req as any).uuid = "user-1";
      (req as any).user = {
        toJSON: () => {
          throw new Error("fail");
        },
      };
      const res = createMockResponse();

      authValidator(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});

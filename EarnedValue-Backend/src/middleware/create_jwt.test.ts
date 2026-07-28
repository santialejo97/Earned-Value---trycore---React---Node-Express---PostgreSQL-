import { sign } from "jsonwebtoken";
import { createJwt } from "./create_jwt";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-token"),
}));

describe("createJwt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("genera un token JWT con email y uuid", () => {
    const token = createJwt("test@example.com", "user-uuid-1");

    expect(sign).toHaveBeenCalledWith(
      { email: "test@example.com", uuid: "user-uuid-1" },
      "test-jwt-secret",
      { expiresIn: "2h" },
    );
    expect(token).toBe("mock-token");
  });

  it("usa cadena vacía si no hay JWTKEYSECRET", () => {
    const originalSecret = process.env.JWTKEYSECRET;
    delete process.env.JWTKEYSECRET;

    createJwt("other@example.com", "user-uuid-2");

    expect(sign).toHaveBeenCalledWith(
      { email: "other@example.com", uuid: "user-uuid-2" },
      "",
      { expiresIn: "2h" },
    );

    process.env.JWTKEYSECRET = originalSecret;
  });
});

import { Status } from "./constants.interfaces";

describe("Status enum", () => {
  it("define estados válidos del dominio", () => {
    expect(Status.PENDING).toBe("pending");
    expect(Status.IN_PROGRESS).toBe("in_progress");
    expect(Status.COMPLETED).toBe("completed");
    expect(Status.DELETE).toBe("delete");
  });
});

import { describe, expect, it } from "vitest";
import { StatusProject, StatusProjectColors } from "./constants.type";

describe("constants.type", () => {
  it("define etiquetas de estado de proyecto", () => {
    expect(StatusProject.pending).toBe("Pendiente");
    expect(StatusProject.in_progress).toBe("Activo");
    expect(StatusProject.completed).toBe("Completado");
  });

  it("define colores por estado", () => {
    expect(StatusProjectColors.pending).toContain("yellow");
    expect(StatusProjectColors.in_progress).toContain("blue");
    expect(StatusProjectColors.completed).toContain("green");
  });
});

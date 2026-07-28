import { describe, expect, it } from "vitest";
import { cn, formatDate, toDate, toTimestamp } from "./utils";

describe("cn", () => {
  it("combina clases de tailwind", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
    expect(cn("px-2", false && "hidden", "py-1")).toBe("px-2 py-1");
  });

  it("resuelve clases conflictivas de tailwind", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("toDate", () => {
  it("retorna undefined para valores nulos", () => {
    expect(toDate(null)).toBeUndefined();
    expect(toDate(undefined)).toBeUndefined();
  });

  it("retorna la misma instancia si ya es Date válida", () => {
    const date = new Date("2024-05-10");
    expect(toDate(date)).toEqual(date);
  });

  it("parsea strings y timestamps válidos", () => {
    expect(toDate("2024-05-10")?.getFullYear()).toBe(2024);
    expect(toDate(1_715_289_600_000)?.getTime()).toBe(1_715_289_600_000);
  });

  it("retorna undefined para fechas inválidas", () => {
    expect(toDate("fecha-invalida")).toBeUndefined();
  });
});

describe("toTimestamp", () => {
  it("convierte fechas a timestamp", () => {
    const date = new Date("2024-01-15");
    expect(toTimestamp(date)).toBe(date.getTime());
  });

  it("retorna undefined si la fecha es inválida", () => {
    expect(toTimestamp("no-es-fecha")).toBeUndefined();
  });
});

describe("formatDate", () => {
  it("formatea fechas en español", () => {
    expect(formatDate(new Date("2024-05-10T12:00:00"))).toMatch(/10\/05\/2024/);
  });

  it("retorna guión para fechas inválidas", () => {
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("invalid")).toBe("—");
  });
});

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toDate = (value?: string | Date | number | null): Date | undefined => {
  if (value == null) return undefined;

  const parsed = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsed.getTime())) return undefined;

  return parsed;
};

export const toTimestamp = (value?: string | Date | number | null): number | undefined => {
  const date = toDate(value);
  return date?.getTime();
};

export const formatDate = (date?: string | Date | number) => {
  const parsed = toDate(date);

  if (!parsed) return "—";

  return parsed.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

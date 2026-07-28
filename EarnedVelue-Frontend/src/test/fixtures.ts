import type { Activity } from "@/type/activities.type";
import type { Project } from "@/type/projects.type";
import type { User } from "@/auth/interfaces/AuthResponse.interfaces";

export const mockUser: User = {
  id_user: "user-1",
  name: "Test User",
  email: "test@example.com",
  created_at: new Date("2024-01-01"),
  updated_at: new Date("2024-01-01"),
  deleted_at: null,
};

export const createMockActivity = (overrides: Partial<Activity> = {}): Activity => ({
  id_activity: "act-1",
  name: "Actividad de prueba",
  description: "Descripción de prueba",
  budgetCompletion: 1000,
  percentagePlanned: 50,
  percentageCompleted: 40,
  actualCost: 300,
  status: "pending",
  id_user_update: "user-1",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-06-01"),
  id_project: "proj-1",
  id_user: "user-1",
  created_at: new Date("2024-01-01"),
  updated_at: new Date("2024-01-01"),
  deleted_at: null,
  ...overrides,
});

export const createMockProject = (overrides: Partial<Project> = {}): Project => ({
  id: "proj-1",
  name: "Proyecto de prueba",
  description: "Descripción del proyecto",
  status: "pending",
  id_user: "user-1",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  deleted_at: null,
  ...overrides,
});

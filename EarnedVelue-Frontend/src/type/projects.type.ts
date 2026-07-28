export interface ProjectsListResponse {
  ok: boolean;
  projects: Project[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  id_user: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface ProjectByIdResponse {
  ok: boolean;
  project: Project;
}

export interface createOrUpdateProjectResponse {
  ok: boolean;
  msg: string;
  project: Project;
}

export interface deleteProjectResponse {
  ok: boolean;
  msg: string;
}

export interface ProjectEarnedValueMetrics {
  // Valores base
  budgetAtCompletion: number; // BAC
  plannedValue: number; // PV
  earnedValue: number; // EV
  actualCost: number; // AC

  // Variaciones
  costVariance: number; // CV
  scheduleVariance: number; // SV

  // Índices
  costPerformanceIndex: number; // CPI
  schedulePerformanceIndex: number; // SPI

  // Proyecciones
  estimateAtCompletion: number; // EAC
  varianceAtCompletion: number; // VAC
}

export const StatusProject = {
  in_progress: "Activo",
  pending: "Pendiente",
  completed: "Completado",
} as const;

export type StatusProjectKey = keyof typeof StatusProject;

export type StatusProjectLabel = (typeof StatusProject)[StatusProjectKey];

export const StatusProjectColors: Record<StatusProjectKey, string> = {
  completed: "bg-green-500 text-white hover:bg-green-500/90",
  pending: "bg-yellow-500 text-white hover:bg-yellow-500/90",
  in_progress: "bg-blue-500 text-white hover:bg-blue-500/90",
};

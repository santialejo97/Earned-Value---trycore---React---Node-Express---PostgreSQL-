export interface ActivitiesListResponse {
  ok: boolean;
  activities: Activity[];
}

export interface Activity {
  id_activity: string;
  name: string;
  description: string;
  budgetCompletion: number;
  percentagePlanned: number;
  percentageCompleted: number;
  actualCost: number;
  status: string;
  id_user_update: string;
  startDate: Date | string | number;
  endDate: Date | string | number;
  id_project: string;
  id_user: string;
  created_at: Date | string | number;
  updated_at: Date | string | number;
  deleted_at: null;
}

export interface createOrUpdateActivityResponse {
  ok: boolean;
  msg: string;
  activity: Activity;
}

export interface getActivityByIdResponse {
  ok: boolean;
  activity: Activity;
}

export interface deleteActivityResponse {
  ok: boolean;
  msg: string;
}

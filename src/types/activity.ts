export type ActivityType = 'workout' | 'meal' | 'steps';
export type ActivityStatus = 'planned' | 'in_progress' | 'completed';

export interface Activity {
  id: number;
  activity_type: ActivityType;
  title: string;
  description: string;
  date: string;
  duration_minutes: number;
  steps: number | null;
  status: ActivityStatus;
  created_at: string;
  updated_at: string;
  user: number;
}

export interface CreateActivityPayload {
  activity_type: ActivityType;
  title: string;
  description: string;
  date: string;
  duration_minutes: number;
  steps?: number | null;
  status: ActivityStatus;
}

export interface UpdateActivityPayload extends CreateActivityPayload {}

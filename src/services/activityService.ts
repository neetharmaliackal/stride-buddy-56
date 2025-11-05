import { API_ENDPOINTS } from '@/config/api';
import { authService } from './authService';
import type { Activity, CreateActivityPayload, UpdateActivityPayload } from '@/types/activity';

const getAuthHeaders = () => {
  const token = authService.getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const activityService = {
  async getActivities(): Promise<Activity[]> {
    const response = await fetch(API_ENDPOINTS.ACTIVITIES.LIST, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }

    return response.json();
  },

  async createActivity(data: CreateActivityPayload): Promise<Activity> {
    const response = await fetch(API_ENDPOINTS.ACTIVITIES.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create activity');
    }

    return response.json();
  },

  async updateActivity(id: number, data: UpdateActivityPayload): Promise<{ detail: string }> {
    const response = await fetch(API_ENDPOINTS.ACTIVITIES.UPDATE(id), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update activity');
    }

    return response.json();
  },

  async deleteActivity(id: number): Promise<void> {
    const response = await fetch(API_ENDPOINTS.ACTIVITIES.DELETE(id), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete activity');
    }
  },
};

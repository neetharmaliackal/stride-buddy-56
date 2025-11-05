export const API_BASE_URL = 'https://fitness-tracker-2025.vercel.app/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register/`,
    LOGIN: `${API_BASE_URL}/auth/login/`,
  },
  ACTIVITIES: {
    LIST: `${API_BASE_URL}/activities/`,
    CREATE: `${API_BASE_URL}/activities/`,
    UPDATE: (id: number) => `${API_BASE_URL}/activities/${id}/`,
    DELETE: (id: number) => `${API_BASE_URL}/activities/${id}/`,
  },
};

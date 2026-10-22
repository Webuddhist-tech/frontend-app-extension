import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export interface CampusFormResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export const submitCampusForm = async (formData: FormData): Promise<CampusFormResponse> => {
  try {
    const { data } = await getAuthenticatedHttpClient().post(
      `${getConfig().STUDIO_BASE_URL}/api/howitworks/contact`,
      formData,
      {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        isPublic: true,
      },
    );
    return data as CampusFormResponse;
  } catch (error) {
    const response = (error as { response?: { data?: CampusFormResponse } }).response?.data;
    if (typeof response?.message === 'string') {
      return response;
    }
    throw error;
  }
};

import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export interface WishlistItem {
  courseId: string;
  title: string;
  imageUrl: string;
  org: string;
  start: string | null;
  advertisedStart: string | null;
  created: string;
}

export interface WishlistPageData {
  count: number;
  next: string | null;
  previous: string | null;
  results: WishlistItem[];
}

const wishlistUrl = () => `${getConfig().LMS_BASE_URL}/api/wishlist/`;

export const fetchWishlist = async (page = 1): Promise<WishlistPageData> => {
  const { data } = await getAuthenticatedHttpClient().get(wishlistUrl(), { params: { page } });
  return camelCaseObject(data) as WishlistPageData;
};

export const removeFromWishlist = async (courseId: string) => {
  await getAuthenticatedHttpClient().delete(`${wishlistUrl()}${encodeURIComponent(courseId)}/`);
};

import axiosInstance from './axiosInstance';

export async function addReview(data) {
  const response = await axiosInstance.post('/reviews', data);
  return response.data;
}

export async function getReviewsByCompany(companyId, sort = 'date', page = 1, limit = 5) {
  const params = new URLSearchParams();
  if (sort) params.append('sort', sort);
  params.append('page', String(page));
  params.append('limit', String(limit));

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await axiosInstance.get(`/reviews/${companyId}${query}`);
  return response.data;
}

export async function likeReview(id) {
  const response = await axiosInstance.patch(`/reviews/${id}/like`);
  return response.data;
}

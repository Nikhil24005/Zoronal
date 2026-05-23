import axiosInstance from './axiosInstance';

export async function createCompany(data) {
  const response = await axiosInstance.post('/api/companies', data);
  return response.data;
}

export async function getAllCompanies(search = '', page = 1, limit = 10) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('page', String(page));
  params.append('limit', String(limit));

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await axiosInstance.get(`/api/companies${query}`);
  return response.data;
}

export async function getCompanyById(id) {
  const response = await axiosInstance.get(`/api/companies/${id}`);
  return response.data;
}

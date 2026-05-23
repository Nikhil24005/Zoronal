import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  throw new Error('Missing VITE_API_URL. Set it in your Vite environment files or deployment settings.');
}

const apiBaseUrl = rawApiUrl.trim().replace(/\/$/, '');

const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default http;

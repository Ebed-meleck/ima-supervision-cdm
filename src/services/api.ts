import axios from 'axios';

const URL = process.env.NEXT_PUBLIC_API || 'http://localhost:9920/api/';

export const api = axios.create({
  baseURL: URL,
});

export default api;
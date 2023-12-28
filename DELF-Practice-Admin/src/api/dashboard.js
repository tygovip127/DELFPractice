import { api } from './config';

export const getSummary = async () => {
  try {
    const response = await api.get('/dashboard/summary');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

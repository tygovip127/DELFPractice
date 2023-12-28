import { api } from './config';

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (err) {
    console.log(err);
  }
  return 0;
};

export const toggleActiveUser = async (_id, active) => {
  try {
    const response = await api.post('/users/active', {
      _id,
      active,
    });
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};

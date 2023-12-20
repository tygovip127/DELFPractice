import { api } from './config'

export const login = async (email, password) => {
    try {
        const response = await api.post('/users/login', {
            email,
            password
        });
        return response.data;
    } catch (err) {
        return 0;
    }
};

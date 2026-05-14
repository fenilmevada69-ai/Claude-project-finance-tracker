import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

export default API;

export const createTransaction = (data) => API.post('/transactions', data);
export const getTransactions = () => API.get('/transactions');
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const getSummary = () => API.get('/transactions/summary');
// src/services/registerUser.ts
import { LoginData, RegisterData } from '@/utils/interfaces';
import { api } from './api'; // Assumindo que 'api' é uma instância configurada do Axios
import axios from 'axios';

export async function registerUser(data: RegisterData) {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("❌ Erro na requisição :");
            console.error("Status:", error.response?.status);
        } else {
            console.error("❌ Erro inesperado:", error);
        }
        throw error;
    }
}

export async function loginUser(data: LoginData) {
    try {
        const response = await api.post('/auth/login', data);
        return response.data;
    } catch (error: any) {
        throw error?.response?.data?.message || "Erro ao fazer login";
    }
}

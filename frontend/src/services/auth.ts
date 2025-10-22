import api from "./api";
import { LoginDTO, RegisterDTO } from "@/utils/dtos";

export const authService = {

    register: async (data: RegisterDTO) => {
        const responce = await api.post("/auth/register", data);
        return responce.data;
    },

    login: async (data: LoginDTO) => {
        const responce = await api.post("/auth/login", data);
        return responce.data;
    }
}
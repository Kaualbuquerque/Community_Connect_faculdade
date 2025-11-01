import { api } from "./api";

export const addFavorite = async (serviceId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Usuário não autenticado");
    }

    const response = await api.post(`/favorites`, { serviceId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getFavorites = async (filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    state?: string;
    city?: string;
    search?: string;
}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Usuário não autenticado");

    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
    if (filters?.state) params.append("state", filters.state);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.search) params.append("search", filters.search);

    const response = await api.get(`/favorites?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const removeFavorite = async (serviceId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Usuário não autenticado");
    }

    const response = await api.delete(`/favorites/${serviceId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

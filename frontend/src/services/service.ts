import { CreateServiceDTO, HistoryDTO } from "@/utils/interfaces";
import { api } from "./api";

export const createService = async (data: CreateServiceDTO) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/services", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllServices = async (filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  city?: string;
  search?: string;
}) => {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);
  if (filters?.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
  if (filters?.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
  if (filters?.state) params.append("state", filters.state);
  if (filters?.city) params.append("city", filters.city);
  if (filters?.search) params.append("search", filters.search);

  const response = await api.get(`/services?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyServices = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/services/my-services", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};


export const updateService = async (serviceId: number, data: CreateServiceDTO) => {
  const token = localStorage.getItem("token");

  const response = await api.put(`/services/${serviceId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteService = async (serviceId: number) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.delete(`/services/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Aqui você pode tratar erros específicos ou repassar
    console.error("Erro ao deletar serviço:", error);
    throw error;
  }
};


export const getHistory = async (consumerId: number) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/history/${consumerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export const saveHistory = async (data: HistoryDTO) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/history", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export const fetchStates = async (): Promise<string[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get("/services/states", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchCities = async (state: string): Promise<string[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/services/cities?state=${state}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
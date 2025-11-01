import { api } from "./api";

export const uploadImages = async (serviceId: number, files: File[]) => {
    const token = localStorage.getItem("token");
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    await api.patch(`/service-images/${serviceId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
};


export const getServiceImages = async (serviceId: number | string): Promise<string[]> => {
    const res = await api.get(`/service-images/${serviceId}`);
    return res.data.map((img: any) => img.url);
};

export const deleteServiceImage = async (imageId: number): Promise<void> => {
    await api.delete(`/service-images/${imageId}`);
};

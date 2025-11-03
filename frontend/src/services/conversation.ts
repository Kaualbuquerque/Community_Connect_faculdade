import { api } from "./api";

export const getConversations = async (userId: number) => {
    const token = localStorage.getItem("token");
    const response = await api.get(`/conversations/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

export const createConversation = async (data: { participantId: number }) => {
    const token = localStorage.getItem("token");
    const res = await api.post("/conversations", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const deleteConversation = async (conversationId: number) => {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/conversations/${conversationId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


export const getMessages = async (conversationId: number) => {
    const token = localStorage.getItem("token");
    const response = await api.get(`/messages/${conversationId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.messages;
}

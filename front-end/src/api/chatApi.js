import axiosInstance from "../lib/axiosInstance";

const chatApi = {
  getChats: async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get("/api/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getChatById: async (chatId) => {
    try {
      const response = await axiosInstance.get(`/api/chats/${chatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createChat: async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.post("/api/chats", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteChat: async (chatId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.delete(`/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addToGroup: async (chatId, userId) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axiosInstance.put(
        "/api/chats/group/add",
        { chatId, userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  removeFromGoup: async (chatId, userId) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axiosInstance.put(
        "/api/chats/group/remove",
        { chatId, userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  editGroup: async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axiosInstance.put(
        "/api/chats/group/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchChat: async (searchQuery) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axiosInstance.get(
        `/api/chats/search?searchQuery=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default chatApi;

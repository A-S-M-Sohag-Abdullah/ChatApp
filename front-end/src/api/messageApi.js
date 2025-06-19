import axiosInstance from "../lib/axiosInstance";

const messageApi = {
  // Get messages for a specific chat
  getMessages: async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/api/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send a new message
  sendMessage: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(`/api/messages/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response?.data || error.message;
    }
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      const response = await axiosInstance.delete(`/api/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search messages
  searchMessages: async (keyword) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/api/messages/search?keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error.response?.data || error.message;
    }
  },

  // Mark messages in a chat as read
  markAsRead: async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(`/api/messages/read/${chatId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default messageApi;

import axios from "axios";

axios.defaults.withCredentials = true;
const BASEURL = "http://192.168.0.109:5000";

const messageApi = {
  // Get messages for a specific chat
  getMessages: async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASEURL}/api/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send a new message
  sendMessage: async (formData) => {
    console.log(formData);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASEURL}/api/messages/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
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
      const response = await axios.delete(
        `${BASEURL}/api/messages/${messageId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchMessages: async (keyword) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASEURL}/api/messages/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },

  markAsRead: async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASEURL}/api/messages/read/${chatId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default messageApi;

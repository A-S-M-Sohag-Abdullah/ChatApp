import axios from "axios";

const BASEURL = "http://localhost:5000";

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
};

export default messageApi;

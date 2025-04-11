import axios from "axios";

const BASEURL = "http://localhost:5000";
const chatApi = {
  // Get all chats for the logged-in user
  getChats: async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${BASEURL}/api/chats`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get details of a specific chat by chatId
  getChatById: async (chatId) => {
    try {
      const response = await axios.get(`${BASEURL}/api/chats/${chatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new chat (DM or Group)
  createChat: async ({ userid, username, users, chatName }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASEURL}/api/chats`,
        {
          userId: userid,
          username: username,
          users: users,
          chatName: chatName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a chat by ID
  deleteChat: async (chatId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${BASEURL}/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addToGroup: async (chatId, userId) => {
    const token = localStorage.getItem("token");

    const { data } = await axios.put(
      `${BASEURL}/api/chats/group/add`,
      { chatId, userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming you use JWT for auth
        },
      }
    );

    return data;
  },

  removeFromGoup: async (chatId, userId) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.put(
        `${BASEURL}/api/chats/group/remove`,
        { chatId, userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming you use JWT for auth
          },
        }
      );

      return data;
    } catch (err) {
      console.log(err.message);
    }
  },

  renameGroup: async (chatId, chatName) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.put(
        `${BASEURL}/api/chats/group/rename`,
        { chatId, chatName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming you use JWT for auth
          },
        }
      );

      return data;
    } catch (err) {
      console.log(err.message);
    }
  },
};

export default chatApi;

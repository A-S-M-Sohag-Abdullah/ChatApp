import axios from "axios";

const BASEURL = "http://localhost:5000";

const userApi = {
  // Get details of the logged-in user
  getUserProfile: async () => {
    try {
      const response = await axios.get(`${BASEURL}/api/users/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASEURL}/api/auth/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Search for users by name or email
  searchUsers: async (query) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASEURL}/api/auth/search?query=${query}`,
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

  // Update user profile
  updateUserProfile: async (userData) => {
    console.log(userData);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(`${BASEURL}/api/auth/update`, userData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change user password
  changePassword: async (passwordData) => {
    try {
      const response = await axios.put("/users/change-password", passwordData);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userApi;

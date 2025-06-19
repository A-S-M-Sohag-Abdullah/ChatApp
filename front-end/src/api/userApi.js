import axiosInstance from "../lib/axiosInstance";

const userApi = {
  // Get details of the logged-in user
  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get("/api/users/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/api/auth/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      const response = await axiosInstance.get(
        `/api/auth/search?query=${query}`,
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

  // Update user profile
  updateUserProfile: async (userData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.put("/api/auth/update", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      const response = await axiosInstance.put(
        "/users/change-password",
        passwordData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userApi;

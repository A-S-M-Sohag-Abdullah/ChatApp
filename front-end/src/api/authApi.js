import axiosInstance from "../lib/axiosInstance";

const authApi = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  signup: async (credentials) => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/signup",
        credentials
      );
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  getUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await axiosInstance.get("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/api/auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await axiosInstance.post(
        `/api/auth/reset-password/${token}`,
        { password }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authApi;

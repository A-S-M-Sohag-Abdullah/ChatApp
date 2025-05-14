import axios from "axios";
const BASEURL = "http://localhost:5000";
const authApi = {
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/auth/login`,
        credentials
      );
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  signup: async (credentials) => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/auth/signup`,
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
    window.location.href = "/login"; // Redirect to login page
  },

  getUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${BASEURL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });
        return response.data;
      }
    } catch (error) {
      return null; // Return null if user is not logged in
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${BASEURL}/api/auth/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/auth/reset-password/${token}`,
        { password }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authApi;

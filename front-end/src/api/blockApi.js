import axiosInstance from "../lib/axiosInstance";

const blockApi = {
  blockUser: async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.post(
        `/api/block/block/${id}`,
        null,
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

  unblockUser: async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.post(
        `/api/block/unblock/${id}`,
        null,
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

export default blockApi;

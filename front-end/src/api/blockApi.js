import axios from "axios";

axios.defaults.withCredentials = true;
const BASEURL = "http://192.168.0.109:5000"; 

const blockApi = {
  blockUser: async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${BASEURL}/api/block/block/${id}`,
        null,
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
  unblockUser: async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${BASEURL}/api/block/unblock/${id}`,
        null,
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
};

export default blockApi;

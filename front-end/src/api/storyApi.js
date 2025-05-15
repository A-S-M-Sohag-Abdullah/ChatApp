import axios from "axios";

axios.defaults.withCredentials = true;
const BASEURL = "http://192.168.0.109:5000"; 

const storyApi = {
  postStory: async (formData) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${BASEURL}/api/stories/post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStories: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASEURL}/api/stories/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token from localStorage (or cookie)
        },
      });

      return response.data; // Set the data to state
    } catch (err) {
      console.error("Error fetching stories:", err);
      throw  err.response?.data?.message || "Something went wrong";
    }
  },
};

export default storyApi;

import axiosInstance from "../lib/axiosInstance";

const storyApi = {
  postStory: async (formData) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axiosInstance.post(
        "/api/stories/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStories: async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get("/api/stories/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching stories:", err);
      throw err.response?.data?.message || "Something went wrong";
    }
  },
};

export default storyApi;

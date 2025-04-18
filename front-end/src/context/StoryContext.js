import { createContext, useContext, useEffect, useState } from "react";
import storyApi from "../api/storyApi";

const StoryContext = createContext();

export const StoryProvider = ({ children }) => {
  const [groupedStories, setGroupedStories] = useState([]);
  const [stories, setStories] = useState([]);
  const [storyOwner, setStoryOwner] = useState();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const fetchedStories = await storyApi.getStories();

        setGroupedStories(fetchedStories);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStories();
  }, []);
  return (
    <StoryContext.Provider
      value={{
        stories,
        setStories,
        storyOwner,
        setStoryOwner,
        groupedStories,
        setGroupedStories,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => useContext(StoryContext);

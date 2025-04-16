import { ToastContainer } from "react-toastify";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { DomProvider } from "./context/DomContext";
import { StoryProvider } from "./context/StoryContext";
import AppRoutes from "./routes/AppRoutes";
import { ActiveStatusProvider } from "./context/ActiveStatusContext";

function App() {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      console.log("Tab is inactive");
      // Pause video, stop animations, etc.
    } else if (document.visibilityState === "visible") {
      console.log("Tab is active");
      // Resume activities
    }
  });

  return (
    <AuthProvider>
      <DomProvider>
        <AppRoutes />
        <ToastContainer />
      </DomProvider>
    </AuthProvider>
  );
}

export default App;

import { ToastContainer } from "react-toastify";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { DomProvider } from "./context/DomContext";
import { StoryProvider } from "./context/StoryContext";
import AppRoutes from "./routes/AppRoutes";
import { ActiveStatusProvider } from "./context/ActiveStatusContext";

function App() {
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

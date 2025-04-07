import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { DomProvider } from "./context/DomContext";
import { StoryProvider } from "./context/StoryContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <DomProvider>
        <ChatProvider>
          <StoryProvider>
            <AppRoutes />
          </StoryProvider>
        </ChatProvider>
      </DomProvider>
    </AuthProvider>
  );
}

export default App;

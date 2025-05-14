import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import LoginPage from "../pages/Auth/LoginPage";

import ChatRoom from "../pages/ChatRoom";
import SignupPage from "../pages/Auth/SignupPage";
import ResetPassword from "../pages/Auth/ResetPassWord";

const AppRoutes = () => {
  const { user } = useAuth(); // Get logged-in user

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/reset-password/:token"
          element={user ? <Navigate to="/chatroom" /> : <ResetPassword />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/chatroom" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/chatroom" /> : <SignupPage />}
        />

        {/* Protected Route */}
        <Route
          path="/chatroom"
          element={user ? <ChatRoom /> : <Navigate to="/login" />}
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={<Navigate to={user ? "/chatroom" : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

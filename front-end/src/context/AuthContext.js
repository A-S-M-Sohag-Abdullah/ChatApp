import { createContext, useContext, useEffect, useState } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authApi.getUser();
        setUser(userData);
      } catch (error) {
        console.log(error.message);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authApi.login(credentials);
      setUser(data.user); // Set user state
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children} {/* Prevent rendering until auth check is done */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

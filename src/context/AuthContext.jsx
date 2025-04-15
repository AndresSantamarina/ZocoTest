import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = sessionStorage.getItem("token");
      const savedUser = sessionStorage.getItem("user");

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
          setRole(parsedUser.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));

    setToken(token);
    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, role, isAuthenticated, loading, login, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

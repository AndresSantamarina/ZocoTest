import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    role: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = sessionStorage.getItem("token");

      if (savedToken) {
        try {
          const userData = decodeToken(savedToken);

          setAuthState({
            token: savedToken,
            user: userData,
            role: userData.role,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          console.error("Error decoding token:", error);
          logout();
        }
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      throw new Error("Invalid token");
    }
  };

  const login = (userData, token) => {
    sessionStorage.setItem("token", token);

    setAuthState({
      token,
      user: userData,
      role: userData.role,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setAuthState({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

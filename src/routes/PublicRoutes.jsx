import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoutes;

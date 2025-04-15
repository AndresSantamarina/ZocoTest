import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoutes = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  return isAuthenticated && role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default AdminRoutes;

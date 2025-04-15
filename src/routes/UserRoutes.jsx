import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserRoutes = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  return isAuthenticated && role === "user" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default UserRoutes;

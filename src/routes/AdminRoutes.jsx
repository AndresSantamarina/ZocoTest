import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return user && user.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default AdminRoutes;

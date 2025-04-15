import { Navigate, Outlet } from "react-router-dom";

const UserRoutes = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return user && user.role === "user" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default UserRoutes;

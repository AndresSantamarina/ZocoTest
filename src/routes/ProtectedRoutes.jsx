import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;

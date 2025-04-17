import "./Dashboard.scss";
import { useContext } from "react";
import AdminSection from "./AdminSection";
import UserSection from "./UserSection";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, role } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <h2>¡Bienvenido, {user.name}!</h2>
      {role === "admin" ? (
        <AdminSection />
      ) : role === "user" ? (
        <UserSection />
      ) : null}
    </div>
  );
};

export default Dashboard;

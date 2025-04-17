import "./Dash.scss"
import { useContext } from "react";
import UserSection from "../../components/UserSection/UserSection";
import { AuthContext } from "../../context/AuthContext";
import AdminSection from "../../components/AdminSection/AdminSection";

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

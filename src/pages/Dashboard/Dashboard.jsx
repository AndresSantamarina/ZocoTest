import "./Dashboard.scss";
import { useContext, useState } from "react";
import AdminSection from "./AdminSection";
import UserSection from "./UserSection";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, role } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {role === "admin" ? (
        <AdminSection />
      ) : role === "user" ? (
        <UserSection />
      ) : (
        <p>Bienvenido. Iniciá sesión para ver tu información.</p>
      )}
    </div>
  );
};

export default Dashboard;

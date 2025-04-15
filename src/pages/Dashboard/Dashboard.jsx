import "./Dashboard.scss";
import { useState } from "react";
import AdminSection from "./AdminSection";
import UserSection from "./UserSection";

const userRole = sessionStorage.getItem("userRole") || "admin";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Crear Usuario");
  const [selectedUser, setSelectedUser] = useState(null);
  const [educationInput, setEducationInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [editEducationIndex, setEditEducationIndex] = useState(null);
  const [editAddressIndex, setEditAddressIndex] = useState(null);
  const [educations, setEducations] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ana",
      email: "ana@ejemplo.com",
      role: "user",
      education: "Tecnicatura en Programación",
      address: "Calle Falsa 123",
    },
  ]);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {userRole === "admin" ? (
        <AdminSection
          users={users}
          setUsers={setUsers}
          showModal={showModal}
          setShowModal={setShowModal}
          modalTitle={modalTitle}
          setModalTitle={setModalTitle}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      ) : userRole === "user" ? (
        <UserSection
          educationInput={educationInput}
          setEducationInput={setEducationInput}
          addressInput={addressInput}
          setAddressInput={setAddressInput}
          educations={educations}
          setEducations={setEducations}
          addresses={addresses}
          setAddresses={setAddresses}
          editEducationIndex={editEducationIndex}
          setEditEduactionIndex={setEditEducationIndex}
          editAddressIndex={editAddressIndex}
          setEditAddressIndex={setEditAddressIndex}
        />
      ) : (
        <p>Bienvenido. Iniciá sesión para ver tu información.</p>
      )}
    </div>
  );
};

export default Dashboard;

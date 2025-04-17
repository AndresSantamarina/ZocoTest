import { useState } from "react";
import UserModal from "../Modal/UserModal";
import useAdminData from "../../hooks/useAdminData";
import UsersTable from "./UsersTable";
import { HiUserAdd } from "react-icons/hi";

const AdminSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("CREAR USUARIO");
  const [selectedUser, setSelectedUser] = useState(null);

  const { users, educations, addresses, refreshData, deleteUser } =
    useAdminData();

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setModalTitle("CREAR USUARIO");
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setModalTitle("EDITAR USUARIO");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    refreshData();
  };

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h3>Gestión de Usuarios</h3>
        <button onClick={handleOpenCreate} className="button-create-user">
          <HiUserAdd />
        </button>
      </div>
      <UserModal
        show={showModal}
        onClose={handleCloseModal}
        title={modalTitle}
        onSubmit={refreshData}
        initialData={selectedUser}
      />

      <UsersTable
        users={users}
        educations={educations}
        addresses={addresses}
        onEdit={handleOpenEdit}
        onDelete={deleteUser}
      />
    </div>
  );
};

export default AdminSection;

import { FaEdit } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import UserModal from "../../components/Modal/UserModal";

const AdminSection = ({
  users,
  setUsers,
  showModal,
  setShowModal,
  modalTitle,
  setModalTitle,
  selectedUser,
  setSelectedUser,
}) => {
  const handleOpenCreate = () => {
    setSelectedUser(null);
    setModalTitle("Crear Usuario");
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setModalTitle("Editar Usuario");
    setShowModal(true);
  };

  const handleSubmit = (data) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...data } : u))
      );
    } else {
      const newUser = { id: Date.now(), ...data };
      setUsers((prev) => [...prev, newUser]);
    }
  };

  const handleDeleteUser = (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (confirm) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="admin-section">
      <h3>Gestión de Usuarios</h3>
      <button onClick={handleOpenCreate} className="button-confirm">
        <HiUserAdd />
      </button>
      <UserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        onSubmit={handleSubmit}
        initialData={selectedUser}
      />
      <div className="user-table">
        <h4>Lista de Usuarios</h4>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Estudios</th>
              <th>Direcciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.education}</td>
                <td>{user.address}</td>
                <td>
                  <button
                    className="button-edit"
                    onClick={() => handleOpenEdit(user)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="button-delete"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSection;

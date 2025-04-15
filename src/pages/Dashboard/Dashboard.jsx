import { MdDelete } from "react-icons/md";
import "./Dashboard.scss";
import { FaEdit } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { HiUserAdd } from "react-icons/hi";
import { useState } from "react";
import UserModal from "../../components/Modal/UserModal";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Crear Usuario");
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ana",
      email: "ana@ejemplo.com",
      role: "user",
      estudios: "Tecnicatura en Programación",
      direcciones: "Calle Falsa 123",
    },
  ]);

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
      console.log("Usuario editado:", data);
    } else {
      const newUser = { id: Date.now(), ...data };
      setUsers((prev) => [...prev, newUser]);
      console.log("Usuario creado:", newUser);
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
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
                  <td>{user.estudios}</td>
                  <td>{user.direcciones}</td>
                  <td>
                    <button
                      className="button-edit"
                      onClick={() => handleOpenEdit(user)}
                    >
                      <FaEdit />
                    </button>
                    <button className="button-delete">
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="user-section">
        <h3>Mi Perfil</h3>
        <p>
          <strong>Nombre:</strong> Usuario Ejemplo
        </p>
        <p>
          <strong>Email:</strong> usuario@ejemplo.com
        </p>
        <div className="related-data">
          <div className="section">
            <h4>Estudios</h4>
            <form className="career-form">
              <input type="text" id="career" placeholder="Agregar estudio" />
              <button className="button-confirm">
                <IoIosAddCircle />
              </button>
            </form>
            <ul>
              <li>
                Licenciatura en Informática
                <button className="button-edit">
                  <FaEdit />
                </button>
                <button className="button-delete">
                  <MdDelete />
                </button>
              </li>
            </ul>
          </div>
          <div className="section">
            <h4>Direcciones</h4>
            <form className="address-form">
              <input type="text" id="address" placeholder="Agregar dirección" />
              <button className="button-confirm">
                <IoIosAddCircle />
              </button>
            </form>
            <ul>
              <li>
                Calle Falsa 123
                <button className="button-edit">
                  <FaEdit />
                </button>
                <button className="button-delete">
                  <MdDelete />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

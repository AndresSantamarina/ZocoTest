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
  const [estudioInput, setEstudioInput] = useState("");
  const [direccionInput, setDireccionInput] = useState("");
  const [editEstudioIndex, setEditEstudioIndex] = useState(null);
  const [editDireccionIndex, setEditDireccionIndex] = useState(null);
  const [estudios, setEstudios] = useState([]);
  const [direcciones, setDirecciones] = useState([]);

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

  const handleDeleteUser = (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (confirm) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    }
  };

  const handleSubmitEstudio = (e) => {
    e.preventDefault();
    if (estudioInput.trim() === "") return;

    if (editEstudioIndex !== null) {
      const updated = [...estudios];
      updated[editEstudioIndex] = estudioInput;
      setEstudios(updated);
      setEditEstudioIndex(null);
    } else {
      setEstudios([...estudios, estudioInput]);
    }

    setEstudioInput("");
  };

  const handleSubmitDireccion = (e) => {
    e.preventDefault();
    if (direccionInput.trim() === "") return;

    if (editDireccionIndex !== null) {
      const updated = [...direcciones];
      updated[editDireccionIndex] = direccionInput;
      setDirecciones(updated);
      setEditDireccionIndex(null);
    } else {
      setDirecciones([...direcciones, direccionInput]);
    }

    setDireccionInput("");
  };

  const handleEditItem = (index, type) => {
    if (type === "estudio") {
      setEstudioInput(estudios[index]);
      setEditEstudioIndex(index);
    } else {
      setDireccionInput(direcciones[index]);
      setEditDireccionIndex(index);
    }
  };

  const handleDeleteItem = (index, type) => {
    if (type === "estudio") {
      setEstudios(estudios.filter((_, i) => i !== index));
      if (editEstudioIndex === index) {
        setEditEstudioIndex(null);
        setEstudioInput("");
      }
    } else {
      setDirecciones(direcciones.filter((_, i) => i !== index));
      if (editDireccionIndex === index) {
        setEditDireccionIndex(null);
        setDireccionInput("");
      }
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
            <form className="career-form" onSubmit={handleSubmitEstudio}>
              <input
                type="text"
                placeholder="Agregar o editar estudio"
                value={estudioInput}
                onChange={(e) => setEstudioInput(e.target.value)}
              />
              <button className="button-confirm">
                <IoIosAddCircle />
              </button>
            </form>
            <ul>
              {estudios.map((item, index) => (
                <li key={index}>
                  {item}
                  <button
                    className="button-edit"
                    onClick={() => handleEditItem(index, "estudio")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="button-delete"
                    onClick={() => handleDeleteItem(index, "estudio")}
                  >
                    <MdDelete />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="section">
            <h4>Direcciones</h4>
            <form className="address-form" onSubmit={handleSubmitDireccion}>
              <input
                type="text"
                placeholder="Agregar o editar dirección"
                value={direccionInput}
                onChange={(e) => setDireccionInput(e.target.value)}
              />
              <button className="button-confirm">
                <IoIosAddCircle />
              </button>
            </form>
            <ul>
              {direcciones.map((item, index) => (
                <li key={index}>
                  {item}
                  <button
                    className="button-edit"
                    onClick={() => handleEditItem(index, "direccion")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="button-delete"
                    onClick={() => handleDeleteItem(index, "direccion")}
                  >
                    <MdDelete />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

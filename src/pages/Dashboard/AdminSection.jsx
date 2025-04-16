import { FaEdit } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import UserModal from "../../components/Modal/UserModal";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AdminSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Crear Usuario");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [educations, setEducations] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, educationsRes, addressesRes] = await Promise.all([
          axios.get("http://localhost:3001/users"),
          axios.get("http://localhost:3001/educations"),
          axios.get("http://localhost:3001/addresses"),
        ]);

        const filteredUsers = usersRes.data.filter(
          (user) => user.role === "user"
        );

        const enrichedUsers = filteredUsers.map((user) => ({
          ...user,
          educations: educationsRes.data.filter(
            (edu) => edu.userId === user.id
          ),
          addresses: addressesRes.data.filter(
            (addr) => addr.userId === user.id
          ),
        }));

        setUsers(enrichedUsers);
        setEducations(educationsRes.data);
        setAddresses(addressesRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [showModal]);

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

  const handleSubmit = async (result) => {
    const fetchData = async () => {
      try {
        const [usersRes, educationsRes, addressesRes] = await Promise.all([
          axios.get("http://localhost:3001/users"),
          axios.get("http://localhost:3001/educations"),
          axios.get("http://localhost:3001/addresses"),
        ]);

        const filteredUsers = usersRes.data.filter(
          (user) => user.role === "user"
        );
        const enrichedUsers = filteredUsers.map((user) => ({
          ...user,
          educations: educationsRes.data.filter(
            (edu) => edu.userId === user.id
          ),
          addresses: addressesRes.data.filter(
            (addr) => addr.userId === user.id
          ),
        }));

        setUsers(enrichedUsers);
        setEducations(educationsRes.data);
        setAddresses(addressesRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  };

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario y todos sus datos relacionados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all([
            ...educations
              .filter((edu) => edu.userId === id)
              .map((edu) =>
                axios.delete(`http://localhost:3001/educations/${edu.id}`)
              ),
            ...addresses
              .filter((addr) => addr.userId === id)
              .map((addr) =>
                axios.delete(`http://localhost:3001/addresses/${addr.id}`)
              ),
          ]);

          await axios.delete(`http://localhost:3001/users/${id}`);

          const [usersRes, educationsRes, addressesRes] = await Promise.all([
            axios.get("http://localhost:3001/users"),
            axios.get("http://localhost:3001/educations"),
            axios.get("http://localhost:3001/addresses"),
          ]);

          const filteredUsers = usersRes.data.filter(
            (user) => user.role === "user"
          );
          const enrichedUsers = filteredUsers.map((user) => ({
            ...user,
            educations: educationsRes.data.filter(
              (edu) => edu.userId === user.id
            ),
            addresses: addressesRes.data.filter(
              (addr) => addr.userId === user.id
            ),
          }));

          setUsers(enrichedUsers);
          setEducations(educationsRes.data);
          setAddresses(addressesRes.data);

          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El usuario y sus datos han sido eliminados.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error", "No se pudo eliminar el usuario", "error");
        }
      }
    });
  };

  const getUserEducations = (userId) => {
    return (
      educations
        .filter((edu) => edu.userId === userId)
        .map((edu) => edu.title)
        .join(", ") || "Sin estudios"
    );
  };

  const getUserAddresses = (userId) => {
    return (
      addresses
        .filter((addr) => addr.userId === userId)
        .map((addr) => `${addr.address}`)
        .join("; ") || "Sin direcciones"
    );
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
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        title={modalTitle}
        onSubmit={handleSubmit}
        initialData={selectedUser}
      />
      <div className="user-table">
        <h4>Lista de Usuarios</h4>
        {users.length === 0 ? (
          <p>Cargando usuarios...</p>
        ) : (
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
                  <td>{getUserEducations(user.id)}</td>
                  <td>{getUserAddresses(user.id)}</td>
                  <td>
                    <div className="actions">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminSection;
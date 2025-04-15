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

        setUsers(usersRes.data);
        setEducations(educationsRes.data);
        setAddresses(addressesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      }
    };

    fetchData();
  }, [token]);

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

  const handleSubmit = async (data) => {
    try {
      const { education, address, ...userData } = data;

      if (selectedUser) {
        // 1. Actualizar datos básicos del usuario
        await axios.put(
          `http://localhost:3001/users/${selectedUser.id}`,
          userData
        );

        // 2. Obtener estudios y direcciones existentes
        const [existingEducations, existingAddresses] = await Promise.all([
          axios.get(
            `http://localhost:3001/educations?userId=${selectedUser.id}`
          ),
          axios.get(
            `http://localhost:3001/addresses?userId=${selectedUser.id}`
          ),
        ]);

        // 3. Actualizar estudios si hay cambios
        if (education) {
          if (existingEducations.data.length > 0) {
            await axios.put(
              `http://localhost:3001/educations/${existingEducations.data[0].id}`,
              {
                ...existingEducations.data[0],
                title: education,
              }
            );
          } else {
            await axios.post("http://localhost:3001/educations", {
              id: Date.now(),
              userId: selectedUser.id,
              title: education,
            });
          }
        }

        // 4. Actualizar direcciones si hay cambios
        if (address) {
          if (existingAddresses.data.length > 0) {
            await axios.put(
              `http://localhost:3001/addresses/${existingAddresses.data[0].id}`,
              {
                ...existingAddresses.data[0],
                address: address,
              }
            );
          } else {
            await axios.post("http://localhost:3001/addresses", {
              id: Date.now(),
              userId: selectedUser.id,
              address: address,
            });
          }
        }

        // Actualizar estado local
        const updatedUsers = users.map((u) =>
          u.id === selectedUser.id ? { ...u, ...userData } : u
        );
        setUsers(updatedUsers);
        setShowModal(false);
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      } else {
        // Crear nuevo usuario (sin estudios/direcciones)
        const { education, address, ...userData } = data;
        const newUser = { ...userData, id: Date.now() };
        await axios.post("http://localhost:3001/users", newUser);
        setUsers([...users, newUser]);

        if (education) {
          await axios.post("http://localhost:3001/educations", {
            id: Date.now() + 1,
            userId: newUser.id,
            title: education,
          });
        }
        if (address) {
          await axios.post("http://localhost:3001/addresses", {
            id: Date.now() + 2,
            userId: newUser.id,
            address: address,
          });
        }
        setShowModal(false);
        Swal.fire("Éxito", "Usuario guardado correctamente", "success");
      }

      // Refrescar datos
      const [usersRes, educationsRes, addressesRes] = await Promise.all([
        axios.get("http://localhost:3001/users"),
        axios.get("http://localhost:3001/educations"),
        axios.get("http://localhost:3001/addresses"),
      ]);
      setUsers(usersRes.data);
      setEducations(educationsRes.data);
      setAddresses(addressesRes.data);
    } catch (error) {
      console.error("Error saving user:", error);
      Swal.fire("Error", "No se pudo guardar el usuario", "error");
    }
  };

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/users/${id}`);
          setUsers(users.filter((user) => user.id !== id));
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El usuario ha sido eliminado.",
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
      <h3>Gestión de Usuarios</h3>
      <button onClick={handleOpenCreate} className="button-confirm">
        <HiUserAdd /> Nuevo usuario
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
                <td>{getUserEducations(user.id)}</td>
                <td>{getUserAddresses(user.id)}</td>
                {/* <td>{user.education}</td>
                <td>{user.address}</td> */}
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

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
      const { educations = [], addresses = [], ...userData } = data;
      
      if (userData.id) {
        // 1. Actualizar datos básicos del usuario
        await axios.put(`http://localhost:3001/users/${userData.id}`, userData);
        
        // 2. Manejar estudios - SOLUCIÓN PARA USUARIOS SIN ESTUDIOS PREVIOS
        const existingEducations = await axios.get(
          `http://localhost:3001/educations?userId=${userData.id}`
        );
  
        // Para cada estudio en el formulario
        await Promise.all(
          educations.map(async (edu) => {
            const educationData = {
              title: edu.title,
              userId: userData.id,
              ...(edu.year && { year: edu.year })
            };
  
            if (edu.id) {
              // Verificar si el estudio existe antes de actualizar
              try {
                await axios.get(`http://localhost:3001/educations/${edu.id}`);
                return axios.put(`http://localhost:3001/educations/${edu.id}`, educationData);
              } catch (error) {
                // Si no existe, crear uno nuevo
                return axios.post('http://localhost:3001/educations', {
                  ...educationData,
                  id: Date.now()
                });
              }
            } else {
              // Crear nuevo estudio
              return axios.post('http://localhost:3001/educations', {
                ...educationData,
                id: Date.now()
              });
            }
          })
        );
  
        // Eliminar estudios existentes que no están en el formulario
        const educationsToKeep = educations.map(edu => edu.id);
        await Promise.all(
          existingEducations.data
            .filter(existing => !educationsToKeep.includes(existing.id))
            .map(edu => axios.delete(`http://localhost:3001/educations/${edu.id}`))
        );
  
        // 3. Manejar direcciones (misma lógica que estudios)
        const existingAddresses = await axios.get(
          `http://localhost:3001/addresses?userId=${userData.id}`
        );
  
        await Promise.all(
          addresses.map(async (addr) => {
            const addressData = {
              address: addr.address,
              userId: userData.id,
              ...(addr.city && { city: addr.city })
            };
  
            if (addr.id) {
              try {
                await axios.get(`http://localhost:3001/addresses/${addr.id}`);
                return axios.put(`http://localhost:3001/addresses/${addr.id}`, addressData);
              } catch {
                return axios.post('http://localhost:3001/addresses', {
                  ...addressData,
                  id: Date.now() + 1 // ID diferente a estudios
                });
              }
            } else {
              return axios.post('http://localhost:3001/addresses', {
                ...addressData,
                id: Date.now() + 1
              });
            }
          })
        );
  
        // Eliminar direcciones existentes que no están en el formulario
        const addressesToKeep = addresses.map(addr => addr.id);
        await Promise.all(
          existingAddresses.data
            .filter(existing => !addressesToKeep.includes(existing.id))
            .map(addr => axios.delete(`http://localhost:3001/addresses/${addr.id}`))
        );
  
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      } else {
        // Crear nuevo usuario
        const newUser = { ...userData, id: Date.now() };
        const userResponse = await axios.post("http://localhost:3001/users", newUser);
  
        // Crear estudios
        await Promise.all(
          educations.map(edu => 
            axios.post("http://localhost:3001/educations", {
              title: edu.title,
              userId: newUser.id,
              id: Date.now() + Math.floor(Math.random() * 1000),
            })
          )
        );
        
        // Crear direcciones
        await Promise.all(
          addresses.map(addr => 
            axios.post("http://localhost:3001/addresses", {
              address: addr.address,
              userId: newUser.id,
              id: Date.now() + Math.floor(Math.random() * 1000),
            })
          )
        );
  
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
      }
      
      // Refrescar datos
      const [usersRes, educationsRes, addressesRes] = await Promise.all([
        axios.get("http://localhost:3001/users"),
        axios.get("http://localhost:3001/educations"),
        axios.get("http://localhost:3001/addresses")
      ]);
      
      setUsers(usersRes.data);
      setEducations(educationsRes.data);
      setAddresses(addressesRes.data);
      
      setShowModal(false);
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

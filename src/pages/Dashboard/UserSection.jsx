import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const UserSection = () => {
  const { user } = useContext(AuthContext);
  const [educationInput, setEducationInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [educations, setEducations] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editEducationIndex, setEditEducationIndex] = useState(null);
  const [editAddressIndex, setEditAddressIndex] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const [educationsRes, addressesRes] = await Promise.all([
          axios.get(`http://localhost:3001/educations?userId=${user.id}`),
          axios.get(`http://localhost:3001/addresses?userId=${user.id}`),
        ]);

        setEducations(educationsRes.data);
        setAddresses(addressesRes.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire(
          "Error",
          "No se pudieron cargar los datos del usuario",
          "error"
        );
      }
    };

    fetchUserData();
  }, [user]);

  const handleSubmitEducation = async (e) => {
    e.preventDefault();
    if (educationInput.trim() === "") {
      Swal.fire("Campo vacío", "Por favor ingresa un estudio.", "warning");
      return;
    }

    try {
      if (editEducationIndex !== null) {
        // Editar estudio existente
        const educationToUpdate = educations[editEducationIndex];
        const updatedEducation = {
          ...educationToUpdate,
          title: educationInput,
        };

        await axios.put(
          `http://localhost:3001/educations/${educationToUpdate.id}`,
          updatedEducation
        );

        const updated = [...educations];
        updated[editEducationIndex] = updatedEducation;
        setEducations(updated);
        setEditEducationIndex(null);
        Swal.fire("Editado", "El estudio fue editado exitosamente.", "success");
      } else {
        // Crear nuevo estudio
        const newEducation = {
          id: Date.now().toString(),
          userId: user.id,
          title: educationInput,
        };

        await axios.post("http://localhost:3001/educations", newEducation);
        setEducations([...educations, newEducation]);
        Swal.fire(
          "Agregado",
          "El estudio fue agregado exitosamente.",
          "success"
        );
      }

      setEducationInput("");
    } catch (error) {
      console.error("Error saving education:", error);
      Swal.fire("Error", "No se pudo guardar el estudio", "error");
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    if (addressInput.trim() === "") {
      Swal.fire("Campo vacío", "Por favor completa el campo.", "warning");
      return;
    }

    try {
      if (editAddressIndex !== null) {
        // Editar dirección existente
        const addressToUpdate = addresses[editAddressIndex];
        const updatedAddress = {
          ...addressToUpdate,
          address: addressInput,
        };

        await axios.put(
          `http://localhost:3001/addresses/${addressToUpdate.id}`,
          updatedAddress
        );

        const updated = [...addresses];
        updated[editAddressIndex] = updatedAddress;
        setAddresses(updated);
        setEditAddressIndex(null);
        Swal.fire(
          "Editado",
          "La dirección fue editada exitosamente.",
          "success"
        );
      } else {
        // Crear nueva dirección
        const newAddress = {
          id: Date.now().toString(),
          userId: user.id,
          address: addressInput,
        };

        await axios.post("http://localhost:3001/addresses", newAddress);
        setAddresses([...addresses, newAddress]);
        Swal.fire(
          "Agregada",
          "La dirección fue agregada exitosamente.",
          "success"
        );
      }

      setAddressInput("");
    } catch (error) {
      console.error("Error saving address:", error);
      Swal.fire("Error", "No se pudo guardar la dirección", "error");
    }
  };

  const handleEditItem = (index, type) => {
    if (type === "education") {
      const education = educations[index];
      setEducationInput(education.title);
      setEditEducationIndex(index);
    } else {
      const address = addresses[index];
      setAddressInput(address.address);
      setEditAddressIndex(index);
    }
  };

  const handleDeleteItem = async (index, type) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (type === "education") {
            const educationId = educations[index].id;
            await axios.delete(
              `http://localhost:3001/educations/${educationId}`
            );
            setEducations(educations.filter((_, i) => i !== index));
            if (editEducationIndex === index) {
              setEditEducationIndex(null);
              setEducationInput("");
            }
            Swal.fire("Eliminado", "El estudio ha sido eliminado.", "success");
          } else {
            const addressId = addresses[index].id;
            await axios.delete(`http://localhost:3001/addresses/${addressId}`);
            setAddresses(addresses.filter((_, i) => i !== index));
            if (editAddressIndex === index) {
              setEditAddressIndex(null);
              setAddressInput("");
            }
            Swal.fire(
              "Eliminado",
              "La dirección ha sido eliminada.",
              "success"
            );
          }
        } catch (error) {
          console.error("Error deleting item:", error);
          Swal.fire("Error", "No se pudo eliminar el elemento", "error");
        }
      }
    });
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="user-section">
      <h3>Mi Perfil</h3>
      <p>
        <strong>Nombre:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <div className="related-data">
        <div className="section">
          <h4>Estudios</h4>
          <form className="education-form" onSubmit={handleSubmitEducation}>
            <input
              type="text"
              placeholder="Agregar o editar estudio"
              value={educationInput}
              onChange={(e) => setEducationInput(e.target.value)}
            />
            <button className="button-confirm">
              <IoIosAddCircle />
            </button>
          </form>
          <ul>
            {educations.map((item, index) => (
              <li key={item.id}>
                {item.title}
                <button
                  className="button-edit"
                  onClick={() => handleEditItem(index, "education")}
                >
                  <FaEdit />
                </button>
                <button
                  className="button-delete"
                  onClick={() => handleDeleteItem(index, "education")}
                >
                  <MdDelete />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h4>Direcciones</h4>
          <form className="address-form" onSubmit={handleSubmitAddress}>
            <input
              type="text"
              placeholder="Agregar o editar dirección"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button className="button-confirm">
              <IoIosAddCircle />
            </button>
          </form>
          <ul>
            {addresses.map((item, index) => (
              <li key={item.id}>
                {item.address}
                <button
                  className="button-edit"
                  onClick={() => handleEditItem(index, "address")}
                >
                  <FaEdit />
                </button>
                <button
                  className="button-delete"
                  onClick={() => handleDeleteItem(index, "address")}
                >
                  <MdDelete />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserSection;

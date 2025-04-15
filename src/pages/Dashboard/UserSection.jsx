import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import Swal from "sweetalert2";

const UserSection = ({
  educationInput,
  setEducationInput,
  addressInput,
  setAddressInput,
  educations,
  setEducations,
  addresses,
  setAddresses,
  editEducationIndex,
  setEditEducationIndex,
  editAddressIndex,
  setEditAddressIndex,
}) => {
  const handleSubmitEducation = (e) => {
    e.preventDefault();
    if (educationInput.trim() === "") {
      Swal.fire("Campo vacío", "Por favor ingresa un estudio.", "warning");
      return;
    }
    console.log(editEducationIndex);
    if (editEducationIndex !== null) {
      const updated = [...educations];
      updated[editEducationIndex] = educationInput;
      setEducations(updated);
      setEditEducationIndex(null);
      Swal.fire("Editado", "El estudio fue editado exitosamente.", "success");
    } else {
      setEducations([...educations, educationInput]);
      Swal.fire("Agregado", "El estudio fue agregado exitosamente.", "success");
    }

    setEducationInput("");
  };

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    if (addressInput.trim() === "") {
      Swal.fire("Campo vacío", "Por favor ingresa una dirección.", "warning");
      return;
    }

    if (editAddressIndex !== null) {
      const updated = [...addresses];
      updated[editAddressIndex] = addressInput;
      setAddresses(updated);
      setEditAddressIndex(null);
      Swal.fire("Editado", "La dirección fue editada exitosamente.", "success");
    } else {
      setAddresses([...addresses, addressInput]);
      Swal.fire(
        "Agregada",
        "La dirección fue agregada exitosamente.",
        "success"
      );
    }

    setAddressInput("");
  };

  const handleEditItem = (index, type) => {
    console.log(index);
    if (type === "education") {
      setEducationInput(educations[index]);
      setEditEducationIndex(index);
    } else {
      setAddressInput(addresses[index]);
      setEditAddressIndex(index);
    }
  };

  const handleDeleteItem = (index, type) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === "education") {
          setEducations(educations.filter((_, i) => i !== index));
          if (editEducationIndex === index) {
            setEditEducationIndex(null);
            setEducationInput("");
          }
          Swal.fire("Eliminado", "El estudio ha sido eliminado.", "success");
        } else {
          setAddresses(addresses.filter((_, i) => i !== index));
          if (editAddressIndex === index) {
            setEditAddressIndex(null);
            setAddressInput("");
          }
          Swal.fire("Eliminado", "La dirección ha sido eliminada.", "success");
        }
      }
    });
  };

  return (
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
              <li key={index}>
                {item}
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
              <li key={index}>
                {item}
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

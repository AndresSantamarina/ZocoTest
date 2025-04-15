import { useEffect, useState } from "react";
import "./UserModal.scss";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";

const UserModal = ({ show, onClose, title, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    education: "",
    address: "",
    role: "user",
    ...initialData,
  });

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      education: "",
      address: "",
      role: "user",
      ...initialData,
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    Swal.fire({
      icon: "success",
      title: "Guardado correctamente",
      text: "Los datos del usuario fueron guardados.",
      timer: 1500,
      showConfirmButton: false,
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Nombre:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Estudios:
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>
          <div className="modal-buttons">
            <button type="submit" className="button-confirm">
              Guardar
            </button>
            <button type="button" className="button-delete" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;

import { useEffect, useState } from "react";
import "./UserModal.scss";
import { IoClose } from "react-icons/io5";

const UserModal = ({ show, onClose, title, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    ...initialData,
  });

  useEffect(() => {
    setFormData({ name: "", email: "", role: "user", ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
            Rol:
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button type="submit" className="button-confirm">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;

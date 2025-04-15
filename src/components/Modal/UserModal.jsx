import { useEffect, useState } from "react";
import "./UserModal.scss";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";

const UserModal = ({ show, onClose, title, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    education: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelatedData = async () => {
      setLoading(true);
      try {
        const [educationsRes, addressesRes] = await Promise.all([
          axios.get(
            `http://localhost:3001/educations?userId=${initialData.id}`
          ),
          axios.get(`http://localhost:3001/addresses?userId=${initialData.id}`),
        ]);

        setFormData({
          ...initialData,
          education: educationsRes.data[0]?.title || "",
          address: addressesRes.data[0]?.address || "",
        });
      } catch (error) {
        console.error("Error fetching related data:", error);
        Swal.fire(
          "Error",
          "No se pudieron cargar los datos relacionados",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (initialData) {
      fetchRelatedData();
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        education: "",
        address: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
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

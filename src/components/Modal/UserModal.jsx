import { useEffect, useState } from "react";
import "./UserModal.scss";
import { IoAdd, IoClose, IoRemove } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";

const UserModal = ({ show, onClose, title, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    educations: [],
    addresses: [],
  });

  const [newEducation, setNewEducation] = useState("");
  const [newAddress, setNewAddress] = useState("");
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
          educations: educationsRes.data,
          addresses: addressesRes.data,
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
        educations: [],
        addresses: [],
      });
    }
  }, [initialData]);

  const handleAddEducation = () => {
    if (newEducation.trim()) {
      setFormData(prev => ({
        ...prev,
        educations: [...prev.educations, { 
          title: newEducation,
          id: Date.now(),
          userId: prev.id || null 
        }]
      }));
      setNewEducation("");
    }
  };

  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index)
    }));
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setFormData(prev => ({
        ...prev,
        addresses: [...prev.addresses, { 
          address: newAddress,
          id: Date.now(),
          userId: prev.id || null 
        }]
      }));
      setNewAddress("");
    }
  };

  const handleRemoveAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que al menos haya un estudio y una dirección
    // if (formData.educations.length === 0 || formData.addresses.length === 0) {
    //   Swal.fire("Error", "Debe agregar al menos un estudio y una dirección", "warning");
    //   return;
    // }
  
    // Preparar datos para enviar
    const dataToSubmit = {
      ...formData,
      // Asegurarse que los nuevos items tengan estructura correcta
      educations: formData.educations.map(edu => ({
        title: edu.title,
        id: edu.id || Date.now(),
        userId: formData.id || null,
      })),
      addresses: formData.addresses.map(addr => ({
        address: addr.address,
        id: addr.id || Date.now() + 1, // ID diferente a estudios
        userId: formData.id || null,
      }))
    };
  
    onSubmit(dataToSubmit);
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
        {loading ? (
          <div className="loading-indicator">Cargando datos...</div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {/* Campos básicos del usuario */}
            <label>
              Nombre:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
            <div className="multi-input-section">
              <label>Estudios:</label>
              {formData.educations.map((edu, index) => (
                <div key={edu.id || index} className="multi-input-item">
                  <input
                    type="text"
                    value={edu.title}
                    onChange={(e) => {
                      const updated = [...formData.educations];
                      updated[index].title = e.target.value;
                      setFormData({...formData, educations: updated});
                    }}
                  />
                  <button
                    type="button"
                    className="button-delete"
                    onClick={() => handleRemoveEducation(index)}
                  >
                    <IoRemove />
                  </button>
                </div>
              ))}
              <div className="add-new-item">
                <input
                  type="text"
                  placeholder="Nuevo estudio"
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                />
                <button
                  type="button"
                  className="button-confirm"
                  onClick={handleAddEducation}
                >
                  <IoAdd />
                </button>
              </div>
            </div>

            <div className="multi-input-section">
              <label>Direcciones:</label>
              {formData.addresses.map((addr, index) => (
                <div key={addr.id || index} className="multi-input-item">
                  <input
                    type="text"
                    value={addr.address}
                    onChange={(e) => {
                      const updated = [...formData.addresses];
                      updated[index].address = e.target.value;
                      setFormData({...formData, addresses: updated});
                    }}
                  />
                  <button
                    type="button"
                    className="button-delete"
                    onClick={() => handleRemoveAddress(index)}
                  >
                    <IoRemove />
                  </button>
                </div>
              ))}
              <div className="add-new-item">
                <input
                  type="text"
                  placeholder="Nueva dirección"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
                <button
                  type="button"
                  className="button-confirm"
                  onClick={handleAddAddress}
                >
                  <IoAdd />
                </button>
              </div>
            </div>

            <div className="modal-buttons">
              <button type="submit" className="button-confirm">
                Guardar
              </button>
              <button type="button" className="button-delete" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserModal;

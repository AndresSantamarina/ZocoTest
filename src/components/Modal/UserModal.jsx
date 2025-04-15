import { useEffect, useState } from "react";
import "./UserModal.scss";
import { IoAdd, IoClose, IoRemove } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";
import {
  createUser,
  updateUser,
  createEducation,
  updateEducation,
  deleteEducation,
  createAddress,
  updateAddress,
  deleteAddress,
  fetchUsers,
} from "../../helpers/apiHelpers.js";

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
      if (!initialData?.id) return;

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

    if (initialData?.id) {
      fetchRelatedData();
    } else {
      // asegurarse de que no falte ninguna propiedad
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
      setFormData((prev) => ({
        ...prev,
        educations: [
          ...prev.educations,
          {
            title: newEducation,
            id: Date.now().toString(),
            userId: prev.id || null,
          },
        ],
      }));
      setNewEducation("");
    }
  };

  const handleRemoveEducation = async (index) => {
    const educationToRemove = formData.educations[index];

    try {
      if (educationToRemove.id) {
        await deleteEducation(educationToRemove.id);
      }

      setFormData((prev) => ({
        ...prev,
        educations: prev.educations.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Error deleting education:", error);
      Swal.fire("Error", "No se pudo eliminar el estudio", "error");
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setFormData((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses,
          {
            address: newAddress,
            id: Date.now().toString(),
            userId: prev.id || null,
          },
        ],
      }));
      setNewAddress("");
    }
  };

  const handleRemoveAddress = async (index) => {
    const addressToRemove = formData.addresses[index];

    try {
      if (addressToRemove.id) {
        await deleteAddress(addressToRemove.id);
      }

      setFormData((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Error deleting address:", error);
      Swal.fire("Error", "No se pudo eliminar la dirección", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;

      if (formData.id) {
        // Editar usuario existente
        await updateUser(formData.id, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        // 2. Obtener estudios y direcciones existentes en la base de datos
        const [existingEducations, existingAddresses] = await Promise.all([
          axios.get(`http://localhost:3001/educations?userId=${formData.id}`),
          axios.get(`http://localhost:3001/addresses?userId=${formData.id}`),
        ]);

        // 3. Manejar estudios - SOLUCIÓN MEJORADA
        await Promise.all(
          formData.educations.map(async (edu) => {
            const educationData = {
              title: edu.title,
              userId: formData.id,
            };

            // Si el estudio no tiene ID o no existe en la base de datos, crear uno nuevo
            if (
              !edu.id ||
              !existingEducations.data.some((e) => e.id === edu.id)
            ) {
              return await createEducation(educationData);
            } else {
              return await updateEducation(edu.id, educationData);
            }
          })
        );

        // 4. Eliminar estudios que ya no están en el formulario
        const educationsToKeep = formData.educations
          .map((edu) => edu.id)
          .filter(Boolean);
        await Promise.all(
          existingEducations.data
            .filter((existing) => !educationsToKeep.includes(existing.id))
            .map((edu) => deleteEducation(edu.id))
        );

        // 5. Manejar direcciones - Misma lógica que estudios
        await Promise.all(
          formData.addresses.map(async (addr) => {
            const addressData = {
              address: addr.address,
              userId: formData.id,
            };

            if (
              !addr.id ||
              !existingAddresses.data.some((a) => a.id === addr.id)
            ) {
              return await createAddress(addressData);
            } else {
              return await updateAddress(addr.id, addressData);
            }
          })
        );

        // 6. Eliminar direcciones que ya no están en el formulario
        const addressesToKeep = formData.addresses
          .map((addr) => addr.id)
          .filter(Boolean);
        await Promise.all(
          existingAddresses.data
            .filter((existing) => !addressesToKeep.includes(existing.id))
            .map((addr) => deleteAddress(addr.id))
        );

        result = { action: "updated", user: formData };
      } else {
        // Crear nuevo usuario
        const userRes = await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        const newUserId = userRes.data.id;

        // Crear estudios solo si hay estudios para crear
        if (formData.educations && formData.educations.length > 0) {
          await Promise.all(
            formData.educations.map((edu) =>
              createEducation({
                title: edu.title,
                userId: newUserId, // Usar el ID del nuevo usuario
              })
            )
          );
        }
        // Crear direcciones solo si hay direcciones para crear
        if (formData.addresses && formData.addresses.length > 0) {
          await Promise.all(
            formData.addresses.map((addr) =>
              createAddress({
                address: addr.address,
                userId: newUserId, // Usar el ID del nuevo usuario
              })
            )
          );
        }

        result = { action: "created", userId: newUserId };
      }

      Swal.fire("Éxito", "Usuario guardado correctamente", "success");
      onSubmit(result); // Notificar al padre con el resultado
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      Swal.fire("Error", "No se pudo guardar el usuario", "error");
    } finally {
      setLoading(false);
    }
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
            <div className="multi-input-section">
              <label>Estudios:</label>
              {formData.educations
                .filter((e) => !e.deleted)
                .map((edu, index) => (
                  <div key={edu.id || index} className="multi-input-item">
                    <input
                      type="text"
                      value={edu.title}
                      onChange={(e) => {
                        const updated = [...formData.educations];
                        updated[index].title = e.target.value;
                        setFormData({ ...formData, educations: updated });
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
              {formData.addresses
                .filter((a) => !a.deleted)
                .map((addr, index) => (
                  <div key={addr.id || index} className="multi-input-item">
                    <input
                      type="text"
                      value={addr.address}
                      onChange={(e) => {
                        const updated = [...formData.addresses];
                        updated[index].address = e.target.value;
                        setFormData({ ...formData, addresses: updated });
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

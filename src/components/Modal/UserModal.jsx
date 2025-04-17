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
} from "../../helpers/apiHelpers.js";
import {
  userValidations,
  validateAddress,
  validateEducation,
} from "../../validations/validations.js";
import { useForm } from "react-hook-form";

const UserModal = ({ show, onClose, title, onSubmit, initialData = {} }) => {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      educations: [],
      addresses: [],
    },
  });

  const [newEducation, setNewEducation] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const formData = watch();

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
        reset({
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
      reset({
        name: "",
        email: "",
        password: "",
        role: "user",
        educations: [],
        addresses: [],
      });
    }
  }, [initialData, reset]);

  const handleAddEducation = () => {
    if (newEducation.trim()) {
      const error = validateEducation(newEducation);
      if (error) {
        Swal.fire("Error", error, "error");
        return;
      }

      setValue("educations", [
        ...formData.educations,
        {
          title: newEducation,
          id: Date.now().toString(),
          userId: formData.id || null,
        },
      ]);
      setNewEducation("");
    }
  };

  const handleRemoveEducation = async (index) => {
    const educationToRemove = formData.educations[index];

    try {
      if (educationToRemove.id && typeof educationToRemove.id === "number") {
        await deleteEducation(educationToRemove.id);
      }
      setValue(
        "educations",
        formData.educations.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error deleting education:", error);
      Swal.fire("Error", "No se pudo eliminar el estudio", "error");
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      const error = validateAddress(newAddress);
      if (error) {
        Swal.fire("Error", error, "error");
        return;
      }

      setValue("addresses", [
        ...formData.addresses,
        {
          address: newAddress,
          id: Date.now().toString(),
          userId: formData.id || null,
        },
      ]);
      setNewAddress("");
    }
  };

  const handleRemoveAddress = async (index) => {
    const addressToRemove = formData.addresses[index];

    try {
      if (addressToRemove.id && typeof addressToRemove.id === "number") {
        await deleteAddress(addressToRemove.id);
      }

      setValue(
        "addresses",
        formData.addresses.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error deleting address:", error);
      Swal.fire("Error", "No se pudo eliminar la dirección", "error");
    }
  };

  const handleEducationChange = (index, value) => {
    const updated = [...formData.educations];
    updated[index].title = value;
    setValue("educations", updated);
  };

  const handleAddressChange = (index, value) => {
    const updated = [...formData.addresses];
    updated[index].address = value;
    setValue("addresses", updated);
  };

  const validateFormData = (data) => {
    for (const edu of data.educations) {
      const error = validateEducation(edu.title);
      if (error) {
        Swal.fire("Error", `Estudio no válido: ${error}`, "error");
        return false;
      }
    }

    for (const addr of data.addresses) {
      const error = validateAddress(addr.address);
      if (error) {
        Swal.fire("Error", `Dirección no válida: ${error}`, "error");
        return false;
      }
    }

    return true;
  };

  const onFormSubmit = async (data) => {
    if (!validateFormData(data)) {
      return;
    }
    setLoading(true);

    try {
      let result;

      if (data.id) {
        await updateUser(data.id, {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        });

        const [existingEducations, existingAddresses] = await Promise.all([
          axios.get(`http://localhost:3001/educations?userId=${data.id}`),
          axios.get(`http://localhost:3001/addresses?userId=${data.id}`),
        ]);

        await Promise.all(
          data.educations.map(async (edu) => {
            const educationData = {
              title: edu.title,
              userId: data.id,
            };
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

        const educationsToKeep = data.educations
          .map((edu) => edu.id)
          .filter(Boolean);
        await Promise.all(
          existingEducations.data
            .filter((existing) => !educationsToKeep.includes(existing.id))
            .map((edu) => deleteEducation(edu.id))
        );

        await Promise.all(
          data.addresses.map(async (addr) => {
            const addressData = {
              address: addr.address,
              userId: data.id,
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

        const addressesToKeep = data.addresses
          .map((addr) => addr.id)
          .filter(Boolean);
        await Promise.all(
          existingAddresses.data
            .filter((existing) => !addressesToKeep.includes(existing.id))
            .map((addr) => deleteAddress(addr.id))
        );

        result = { action: "updated", user: data };
      } else {
        const userRes = await createUser({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        });

        const newUserId = userRes.data.id;

        if (data.educations && data.educations.length > 0) {
          await Promise.all(
            data.educations.map((edu) =>
              createEducation({
                title: edu.title,
                userId: newUserId,
              })
            )
          );
        }
        if (data.addresses && data.addresses.length > 0) {
          await Promise.all(
            data.addresses.map((addr) =>
              createAddress({
                address: addr.address,
                userId: newUserId,
              })
            )
          );
        }

        result = { action: "created", userId: newUserId };
      }

      Swal.fire("Éxito", "Usuario guardado correctamente", "success");
      onSubmit(result);
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
          <form onSubmit={hookFormSubmit(onFormSubmit)} className="modal-form">
            <label>
              Nombre:
              <input type="text" {...register("name", userValidations.name)} />
              {errors.name && (
                <span className="error-message">{errors.name.message}</span>
              )}
            </label>
            <label>
              Email:
              <input
                type="email"
                {...register("email", userValidations.email)}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </label>
            <label>
              Password:
              <input
                type="password"
                {...register("password", userValidations.password)}
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
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
                      onChange={(e) =>
                        handleEducationChange(index, e.target.value)
                      }
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
                      onChange={(e) =>
                        handleAddressChange(index, e.target.value)
                      }
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

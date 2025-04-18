import "./UserModal.scss";
import { IoClose } from "react-icons/io5";
import UserForm from "./UserForm";
import useUserModal from "../../hooks/useUserModal";
import { useEffect } from "react";

const UserModal = ({ show, onClose, title, onSubmit, initialData = {} }) => {
  const {
    formData,
    errors,
    loading,
    newEducation,
    newAddress,
    register,
    hookFormSubmit,
    handleAddEducation,
    handleRemoveEducation,
    handleAddAddress,
    handleRemoveAddress,
    handleEducationChange,
    handleAddressChange,
    onFormSubmit,
    setNewEducation,
    setNewAddress,
  } = useUserModal({ initialData, onSubmit, onClose });

  const handleClose = () => {
    setNewEducation("");
    setNewAddress("");
    onClose();
  };

  useEffect(() => {
    if (show) {
      setNewEducation("");
      setNewAddress("");
    }
  }, [show, setNewEducation, setNewAddress]);

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={handleClose}>
            <IoClose />
          </button>
        </div>
        {loading ? (
          <div className="loading-indicator">Cargando datos...</div>
        ) : (
          <UserForm
            formData={formData}
            errors={errors}
            newEducation={newEducation}
            newAddress={newAddress}
            register={register}
            hookFormSubmit={hookFormSubmit}
            handleAddEducation={handleAddEducation}
            handleRemoveEducation={handleRemoveEducation}
            handleAddAddress={handleAddAddress}
            handleRemoveAddress={handleRemoveAddress}
            handleEducationChange={handleEducationChange}
            handleAddressChange={handleAddressChange}
            onFormSubmit={onFormSubmit}
            setNewEducation={setNewEducation}
            setNewAddress={setNewAddress}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default UserModal;

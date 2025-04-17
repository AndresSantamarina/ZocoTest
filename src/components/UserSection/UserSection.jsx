import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useUserData from "../../hooks/useUserData";
import EducationSection from "./EducationSection";
import AddressSection from "./AddressSection";

const UserSection = () => {
  const { user } = useContext(AuthContext);
  const [educationInput, setEducationInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [editEducationIndex, setEditEducationIndex] = useState(null);
  const [editAddressIndex, setEditAddressIndex] = useState(null);

  const {
    educations,
    addresses,
    loading,
    handleEducation,
    handleAddress,
    deleteItem,
  } = useUserData(user?.id);

  const handleSubmitEducation = async (e) => {
    e.preventDefault();
    const result = await handleEducation(educationInput, editEducationIndex);
    if (result) {
      setEducationInput("");
      setEditEducationIndex(null);
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    const result = await handleAddress(addressInput, editAddressIndex);
    if (result) {
      setAddressInput("");
      setEditAddressIndex(null);
    }
  };

  const handleEditItem = (index, type) => {
    if (type === "education") {
      setEducationInput(educations[index].title);
      setEditEducationIndex(index);
    } else {
      setAddressInput(addresses[index].address);
      setEditAddressIndex(index);
    }
  };

  const handleCancelEdit = (type) => {
    if (type === "education") {
      setEditEducationIndex(null);
      setEducationInput("");
    } else {
      setEditAddressIndex(null);
      setAddressInput("");
    }
  };

  if (!user || loading) return <p>Cargando...</p>;

  return (
    <div className="user-section">
      <h3>MI PERFIL</h3>
      <p>
        <strong>Nombre:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <div className="content-wrapper">
        <div className="related-data">
          <EducationSection
            educationInput={educationInput}
            setEducationInput={setEducationInput}
            editEducationIndex={editEducationIndex}
            educations={educations}
            handleSubmitEducation={handleSubmitEducation}
            handleEditItem={handleEditItem}
            handleCancelEdit={handleCancelEdit}
            deleteItem={deleteItem}
          />

          <AddressSection
            addressInput={addressInput}
            setAddressInput={setAddressInput}
            editAddressIndex={editAddressIndex}
            addresses={addresses}
            handleSubmitAddress={handleSubmitAddress}
            handleEditItem={handleEditItem}
            handleCancelEdit={handleCancelEdit}
            deleteItem={deleteItem}
          />
        </div>
      </div>
    </div>
  );
};

export default UserSection;

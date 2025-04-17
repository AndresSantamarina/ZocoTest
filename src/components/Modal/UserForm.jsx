import { userValidations } from "../../validations/validations";
import AddressForm from "./AddressForm";
import EducationForm from "./EducationForm";
import UserModalFooter from "./UserModalFooter";

const UserForm = ({
  formData,
  errors,
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
  onClose,
}) => (
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
      <input type="email" {...register("email", userValidations.email)} />
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

    <EducationForm
      educations={formData.educations}
      newEducation={newEducation}
      setNewEducation={setNewEducation}
      handleAddEducation={handleAddEducation}
      handleRemoveEducation={handleRemoveEducation}
      handleEducationChange={handleEducationChange}
    />

    <AddressForm
      addresses={formData.addresses}
      newAddress={newAddress}
      setNewAddress={setNewAddress}
      handleAddAddress={handleAddAddress}
      handleRemoveAddress={handleRemoveAddress}
      handleAddressChange={handleAddressChange}
    />

    <UserModalFooter onClose={onClose} />
  </form>
);

export default UserForm;

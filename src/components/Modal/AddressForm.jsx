import { IoAdd, IoRemove } from "react-icons/io5";

const AddressForm = ({
  addresses,
  newAddress,
  setNewAddress,
  handleAddAddress,
  handleRemoveAddress,
  handleAddressChange,
}) => (
  <div className="multi-input-section">
    <label>Direcciones:</label>
    {addresses
      .filter((a) => !a.deleted)
      .map((addr, index) => (
        <div key={addr.id || index} className="multi-input-item">
          <input
            type="text"
            value={addr.address}
            onChange={(e) => handleAddressChange(index, e.target.value)}
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
);

export default AddressForm;

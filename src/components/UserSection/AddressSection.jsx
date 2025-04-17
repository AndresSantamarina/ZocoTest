import { FaEdit } from "react-icons/fa";
import { MdCancel, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

const AddressSection = ({
  addressInput,
  setAddressInput,
  editAddressIndex,
  addresses,
  handleSubmitAddress,
  handleEditItem,
  handleCancelEdit,
  deleteItem,
}) => (
  <div className="section">
    <h4>DIRECCIONES</h4>
    <form className="address-form" onSubmit={handleSubmitAddress}>
      <input
        type="text"
        placeholder="Agregar o editar dirección"
        value={addressInput}
        onChange={(e) => setAddressInput(e.target.value)}
      />
      <button className="button-confirm">
        <IoIosAddCircle />
      </button>
    </form>
    <ul>
      {addresses.map((item, index) => (
        <li key={item.id}>
          <span>{item.address}</span>
          <div className="actions">
            {editAddressIndex === index && (
              <button
                className="button-cancel"
                onClick={() => handleCancelEdit("address")}
              >
                <MdCancel />
              </button>
            )}
            <button
              className="button-edit"
              onClick={() => handleEditItem(index, "address")}
            >
              <FaEdit />
            </button>
            <button
              className="button-delete"
              onClick={() => deleteItem(index, "address")}
            >
              <MdDelete />
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default AddressSection;

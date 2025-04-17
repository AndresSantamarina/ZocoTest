import { FaEdit } from "react-icons/fa";
import { MdCancel, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

const EducationSection = ({
  educationInput,
  setEducationInput,
  editEducationIndex,
  educations,
  handleSubmitEducation,
  handleEditItem,
  handleCancelEdit,
  deleteItem,
}) => (
  <div className="section">
    <h4>ESTUDIOS</h4>
    <form className="education-form" onSubmit={handleSubmitEducation}>
      <input
        type="text"
        placeholder="Agregar o editar estudio"
        value={educationInput}
        onChange={(e) => setEducationInput(e.target.value)}
      />
      <button className="button-confirm">
        <IoIosAddCircle />
      </button>
    </form>
    <ul>
      {educations.map((item, index) => (
        <li key={item.id}>
          <span>{item.title}</span>
          <div className="actions">
            {editEducationIndex === index && (
              <button
                className="button-cancel"
                onClick={() => handleCancelEdit("education")}
              >
                <MdCancel />
              </button>
            )}
            <button
              className="button-edit"
              onClick={() => handleEditItem(index, "education")}
            >
              <FaEdit />
            </button>
            <button
              className="button-delete"
              onClick={() => deleteItem(index, "education")}
            >
              <MdDelete />
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default EducationSection;

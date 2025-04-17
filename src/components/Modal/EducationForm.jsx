import { IoAdd, IoRemove } from "react-icons/io5";

const EducationForm = ({
  educations,
  newEducation,
  setNewEducation,
  handleAddEducation,
  handleRemoveEducation,
  handleEducationChange,
}) => (
  <div className="multi-input-section">
    <label>Estudios:</label>
    {educations
      .filter((e) => !e.deleted)
      .map((edu, index) => (
        <div key={edu.id || index} className="multi-input-item">
          <input
            type="text"
            value={edu.title}
            onChange={(e) => handleEducationChange(index, e.target.value)}
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
);

export default EducationForm;

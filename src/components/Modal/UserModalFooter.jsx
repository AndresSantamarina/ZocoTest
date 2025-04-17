const UserModalFooter = ({ onClose }) => (
  <div className="modal-buttons">
    <button type="submit" className="button-confirm">
      Guardar
    </button>
    <button type="button" className="button-delete" onClick={onClose}>
      Cancelar
    </button>
  </div>
);

export default UserModalFooter;

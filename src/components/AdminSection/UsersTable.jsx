import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const UsersTable = ({ users, educations, addresses, onEdit, onDelete }) => {
  const getUserEducations = (userId) => {
    return (
      educations
        .filter((edu) => edu.userId === userId)
        .map((edu) => edu.title)
        .join(", ") || "Sin estudios"
    );
  };

  const getUserAddresses = (userId) => {
    return (
      addresses
        .filter((addr) => addr.userId === userId)
        .map((addr) => `${addr.address}`)
        .join("; ") || "Sin direcciones"
    );
  };

  if (users.length === 0) return <p>Cargando usuarios...</p>;

  return (
    <div className="user-table">
      <h4>Lista de Usuarios</h4>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estudios</th>
            <th>Direcciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{getUserEducations(user.id)}</td>
              <td>{getUserAddresses(user.id)}</td>
              <td>
                <div className="actions">
                  <button className="button-edit" onClick={() => onEdit(user)}>
                    <FaEdit />
                  </button>
                  <button
                    className="button-delete"
                    onClick={() => onDelete(user.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

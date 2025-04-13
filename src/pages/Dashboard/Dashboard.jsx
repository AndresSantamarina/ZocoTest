import { MdDelete } from "react-icons/md";
import "./Dashboard.scss";
import { FaEdit } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { HiUserAdd } from "react-icons/hi";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="admin-section">
        <h3>Gestión de Usuarios</h3>
        <button className="button-confirm">
          <HiUserAdd />
        </button>

        <div className="user-table">
          <h4>Lista de Usuarios</h4>
          {/* Tabla mock */}
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
              <tr>
                <td>Ana</td>
                <td>ana@ejemplo.com</td>
                <td>Tecnicatura en Programación</td>
                <td>Calle Falsa 123</td>
                <td>
                  <button className="button-edit">Editar</button>
                  <button className="button-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="user-section">
        <h3>Mi Perfil</h3>
        {/* Info mock */}
        <p>
          <strong>Nombre:</strong> Usuario Ejemplo
        </p>
        <p>
          <strong>Email:</strong> usuario@ejemplo.com
        </p>

        <div className="related-data">
          <div className="section">
            <h4>Estudios</h4>
            <form className="career-form">
              <input type="text" id="career" placeholder="Agregar estudio" />
              <button className="button-confirm">
                <IoIosAddCircle />
              </button>
            </form>
            <ul>
              <li>
                Licenciatura en Informática
                <button className="button-edit">
                  <FaEdit />
                </button>
                <button className="button-delete">
                  <MdDelete />
                </button>
              </li>
            </ul>
          </div>

          <div className="section">
            <h4>Direcciones</h4>
            <form className="address-form">
              <input type="text" id="address" placeholder="Agregar dirección" />
              <button className="button-confirm">
                <IoIosAddCircle />
              </button>
            </form>
            <ul>
              <li>
                Calle Falsa 123
                <button className="button-edit">
                  <FaEdit />
                </button>
                <button className="button-delete">
                  <MdDelete />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

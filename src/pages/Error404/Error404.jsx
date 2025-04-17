import { Link } from "react-router-dom";
import "./Error404.scss";

const Error404 = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

export default Error404;

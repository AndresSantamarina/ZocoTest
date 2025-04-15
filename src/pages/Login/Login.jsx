import { useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const fakeUser = {
      id: "123",
      name: "Juan Pérez",
      role: "admin", // o "user"
    };

    sessionStorage.setItem("user", JSON.stringify(fakeUser));
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Ingresa tu email" />
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Ingresa tu contraseña"
        />

        <button type="submit" className="button-confirm">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

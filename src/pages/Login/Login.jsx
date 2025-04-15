import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import "./Login.scss";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        `http://localhost:3001/users?email=${email}&password=${password}`
      );
      const userData = res.data[0];

      if (userData) {
        const fakeToken = Math.random().toString(36).substring(2); // simula un JWT
        login(userData, fakeToken);

        Swal.fire({
          title: `¡Bienvenido, ${userData.name}!`,
          text: "Has iniciado sesión correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire("Error", "Credenciales incorrectas", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al iniciar sesión", "error");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="button-confirm">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:3001/users?email=${email}&password=${password}`
      );

      if (res.data.length === 0) {
        throw new Error("Credenciales incorrectas");
      }

      const userData = res.data[0];
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
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Credenciales incorrectas", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>INICIAR SESIÓN</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="button-confirm" disabled={loading}>
          {loading ? "Cargando..." : "ACCEDER"}
        </button>
      </form>
    </div>
  );
};

export default Login;

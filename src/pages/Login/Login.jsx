import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import "./Login.scss";
import { useForm } from "react-hook-form";
import { loginValidation } from "../../validations/validations";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const generateToken = (userData) => {
    const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
    const payload = JSON.stringify({
      id: userData.id,
      email: userData.email,
      role: userData.role,
      name: userData.name,
    });

    return `${btoa(header)}.${btoa(payload)}.${Math.random()
      .toString(36)
      .substring(2, 10)}`;
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/users?email=${data.email}&password=${data.password}`
      );

      if (res.data.length === 0) {
        throw new Error("Credenciales incorrectas");
      }

      const userData = res.data[0];
      const token = generateToken(userData);

      login(userData, token);

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
    }
  };

  return (
    <div className="login-container">
      <h2>INICIAR SESIÓN</h2>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Ingresa tu email"
          {...register("email", loginValidation.email)}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Ingresa tu contraseña"
          {...register("password", loginValidation.password)}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button
          type="submit"
          className="button-confirm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Cargando..." : "ACCEDER"}
        </button>
      </form>
    </div>
  );
};

export default Login;

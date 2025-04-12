import "./Login.scss";

const Login = () => {
  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form className="login-form">
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

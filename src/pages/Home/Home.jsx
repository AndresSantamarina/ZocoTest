import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Home.scss";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="home">
      <div className="home__container">
        <h1 className="home__title">¡Bienvenido/a!</h1>
        <p className="home__subtitle">
          Iniciá sesión para acceder a tu información personal y gestionar tus
          datos.
        </p>
      </div>
    </section>
  );
};

export default Home;

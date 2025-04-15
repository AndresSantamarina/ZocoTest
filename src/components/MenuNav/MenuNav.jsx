import { useNavigate } from "react-router-dom";
import "./MenuNav.scss";
import Swal from "sweetalert2";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const MenuNav = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); //  Usa la función del contexto
        Swal.fire({
          title: "Sesión cerrada",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    });
  };

  return (
    <nav className="menu-nav">
      <div className="menu-nav__left" onClick={handleLogoClick}>
        ZocoTest
      </div>
      <div className="menu-nav__right">
        {isAuthenticated ? (
          <button className="button-delete" onClick={handleLogout}>
            <BiLogOut />
          </button>
        ) : (
          <button className="button-edit" onClick={() => navigate("/login")}>
            <BiLogIn />
          </button>
        )}
      </div>
    </nav>
  );
};

export default MenuNav;

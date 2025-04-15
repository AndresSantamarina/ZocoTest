import { useNavigate } from "react-router-dom";
import "./MenuNav.scss";
import Swal from "sweetalert2";
import { BiLogIn, BiLogOut } from "react-icons/bi";

const MenuNav = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogoClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="menu-nav">
      <div className="menu-nav__left" onClick={handleLogoClick}>
        ZocoTest
      </div>
      <div className="menu-nav__right">
        {user ? (
          <button
            className="button-delete"
            onClick={() => {
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
                  sessionStorage.clear();
                  Swal.fire({
                    title: "Sesión cerrada",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  });
                  navigate("/login");
                }
              });
            }}
          >
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

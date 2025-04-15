import { useNavigate } from "react-router-dom";
import "./MenuNav.scss";

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
        <button className="button-edit" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default MenuNav;

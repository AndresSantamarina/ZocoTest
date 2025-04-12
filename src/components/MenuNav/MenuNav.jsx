import "./MenuNav.scss";

const MenuNav = () => {
  return (
    <nav className="menu-nav">
      <div className="menu-nav__left">ZocoTest</div>
      <div className="menu-nav__right">
        <button className="button-edit">
          Login
        </button>
      </div>
    </nav>
  );
};

export default MenuNav;
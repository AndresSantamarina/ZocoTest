import { Outlet } from "react-router-dom";
import MenuNav from "../MenuNav/MenuNav";
import Footer from "../Footer/Footer";

const Layout = () => {
  return (
    <div className="layout">
      <MenuNav />
      <main className="layout__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

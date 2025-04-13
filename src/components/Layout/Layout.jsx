import { Outlet } from "react-router-dom";
import MenuNav from "../MenuNav/MenuNav";
import Footer from "../Footer/Footer";
import "./Layout.scss";
import Dashboard from "../../pages/Dashboard/Dashboard";

const Layout = () => {
  return (
    <div className="layout">
      <MenuNav />
      <main className="layout__content">
        <Outlet />
        <Dashboard/>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

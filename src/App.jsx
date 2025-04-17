import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import "./assets/styles/main.scss";
import Home from "./pages/Home/Home";
import PublicRoutes from "./routes/PublicRoutes";
import Error404 from "./pages/Error404/Error404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PublicRoutes />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route element={<AdminRoutes />}></Route>
            <Route element={<UserRoutes />}></Route>
          </Route>
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

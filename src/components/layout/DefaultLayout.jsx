import { Outlet } from "react-router-dom";
import "./layout.scss";
function DefaultLayout() {
  return (
    <div className="container-fluid py-2">
      <Outlet />
    </div>
  );
}

export default DefaultLayout;

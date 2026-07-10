import { NavLink } from "react-router-dom";
import "../../styles/layout/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2>Stock App</h2>

      <NavLink to="/products">
        Products
      </NavLink>

      <NavLink to="/stores">
        Stores
      </NavLink>

      <NavLink to="/stock">
        Stock
      </NavLink>

    </div>
  );
}

export default Sidebar;
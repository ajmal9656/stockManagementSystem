import { useSelector } from "react-redux";
import "../../styles/layout/Navbar.css";

function Navbar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="navbar">
      <h3>Stock Management System</h3>

      <span>
        {user?.name} ({user?.role})
      </span>
    </div>
  );
}

export default Navbar;
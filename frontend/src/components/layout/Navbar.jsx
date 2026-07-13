import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "../../styles/layout/Navbar.css";
import { logout } from "../../services/authService";
import { logoutUser } from "../../redux/slice/authSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();

      dispatch(logoutUser());

      toast.success(response.message);

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="navbar">
      <h3>Stock Management System</h3>

      <div>
        <span>
          {user?.name} ({user?.role})
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;

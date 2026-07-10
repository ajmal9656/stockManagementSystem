import "../../styles/auth/Login.css";

import { useForm } from "react-hook-form";

import { login as loginUser } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSuccess } from "../../redux/slice/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      console.log(response);

      alert("Login Successful");
      toast.success("Login Successful");

      dispatch(loginSuccess(response.data));

      navigate("/products");
    } catch (error) {
      console.log("err", error.response);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email",
                },
              })}
            />

            <small className="error-text">{errors.email?.message}</small>
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
              })}
            />

            <small className="error-text">{errors.password?.message}</small>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

          <Link to="/register">Register</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;

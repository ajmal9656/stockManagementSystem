import "../../styles/auth/Register.css";

import { useForm } from "react-hook-form";

import { register as registerUser } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data;
      const response = await registerUser(userData);

      console.log(response);

      toast.success("Registration Successful");

      reset();

      navigate("/login");
    } catch (error) {
      console.log("err", error.response);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Name</label>

            <input
              type="text"
              {...register("name", {
                required: "Name is required",
              })}
            />

            <small className="error-text">{errors.name?.message}</small>
          </div>

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

          <div className="input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            <small className="error-text">
              {errors.confirmPassword?.message}
            </small>
          </div>

          <button className="register-btn" type="submit">
            Register
          </button>

          <Link to="/login">Login</Link>
        </form>
      </div>
    </div>
  );
}

export default Register;

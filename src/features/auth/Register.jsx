import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SocialLogin from "./SocialLogin";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [passwordAlert, setPasswordAlert] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Strong password check
  const validateStrongPassword = (password) => {
    const regex = /^.{6,}$/; // at least 6 characters

    if (!password) {
      setPasswordAlert("");
      return false;
    }

    if (!regex.test(password)) {
      setPasswordAlert("Password must be at least 6 characters.");
      return false;
    }

    setPasswordAlert("");
    return true;
  };

  // typing time validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    validateStrongPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (!name || !email || !password)
      return setError("All fields are required");

    if (!validateStrongPassword(password))
      return setError("Please enter a strong password");

    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      setLoading(true);
      await register(email, password, name);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Account
      </h2>

      {error && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          required
          className="input input-bordered w-full"
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          className="input input-bordered w-full"
        />

        {/* Password */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            onChange={handlePasswordChange}
            className="input input-bordered w-full pr-12"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            required
            className="input input-bordered w-full pr-12"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <SocialLogin />
      {passwordAlert && (
        <p className="text-red-500 text-sm mt-1">{passwordAlert}</p>
      )}

      <p className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-blue-600 hover:underline font-medium"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

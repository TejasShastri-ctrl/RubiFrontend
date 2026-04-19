import { useState } from "react";
import logo from "./assets/rubilogo.png";
import { Lock, Mail } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/login", form);
      const { token, user } = response.data;
      
      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful, role:", user.role);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">

      {/* LEFT PANEL */}
      <div className="relative flex flex-1 items-center justify-center bg-[#e6ebf1]">

        {/* Logo (top-left) */}
        <div className="absolute flex top-3 left-4 gap-2 items-center">
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 flex-shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-light text-xl">RUBISCAPE</span>
            <span className="font-light text-sm">MAKE SENSE</span>
          </div>
        </div>

        {/* Card */}
        <div className="w-[360px] rounded-2xl bg-[#ffffff] p-10 shadow-sm">
          <h2 className="mb-6 text-center text-lg font-semibold">
            SIGN IN
          </h2>

          {error && <div className="mb-4 text-center text-red-500 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">

            {/* Email */}
            <div className="w-[300px] px-6 flex items-center rounded-lg border border-[#6bbfa6] bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-[#6bbfa6]">
              <Mail size={30} className="text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Eg: emp@rubiscape.com"
                value={form.email}
                onChange={handleChange}
                className="ml-2 w-full text-sm outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="w-[300px] px-6 flex items-center rounded-lg border border-[#6bbfa6] bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-[#6bbfa6]">
              <Lock size={30} className="text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                className="ml-2 w-full text-sm outline-none"
                required
              />
            </div>

            {/* Forgot password */}
            <div className="text-right text-xs text-gray-500 hover:underline cursor-pointer">
              Forgot password?
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="rounded-full w-[140px] bg-[#2e4d3d] py-2 cursor-pointer text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          {/* <p className="mt-6 text-center text-xs">
            Don’t have an account?{" "}
            <Link to="/register" className="cursor-pointer text-blue-600 hover:underline">
              Register
            </Link>
          </p> */}

          <p className="mt-1 text-center text-xs">
            Having an issue?{" "}
            <span className="cursor-pointer text-blue-600 hover:underline">
              Help
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden flex-1 flex-col items-center justify-center bg-[#1f8f6a] text-white md:flex">
        <div className="mb-15 flex flex-col items-center">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="logo"
              className="w-30 flex-shrink-0"
            />

            <div>
              <h1 className="text-8xl font-light tracking-wide">
                RUBISCAPE
              </h1>
              <h3 className="text-3xl font-light">
                MAKE SENSE
              </h3>
            </div>
          </div>

          <p className="text-3xl font-light tracking-wide text-stone-800 mt-20">
            WORKFLOW APPROVAL PORTAL
          </p>
        </div>
      </div>
    </div>
  );
}

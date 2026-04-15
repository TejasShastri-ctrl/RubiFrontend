import { useState } from "react";
import logo from "./assets/rubilogo.png";
import { Lock, Mail, User, Phone, Briefcase } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "reviewer",
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
      const response = await axios.post("/api/auth/register", form);
      console.log("Registration successful:", response.data);
      navigate("/"); // Redirect to login after successful registration
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.msg || "Something went wrong. Please try again.");
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
          <img src={logo} alt="logo" className="w-10 h-10 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-light text-xl">RUBISCAPE</span>
            <span className="font-light text-sm">MAKE SENSE</span>
          </div>
        </div>

        {/* Card */}
        <div className="w-[400px] rounded-2xl bg-[#ffffff] p-8 shadow-sm">
          <h2 className="mb-6 text-center text-lg font-semibold">CREATE ACCOUNT</h2>

          {error && <div className="mb-4 text-center text-red-500 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
            {/* Full Name */}
            <div className="w-[320px] px-6 flex items-center rounded-lg border border-[#6bbfa6] bg-white py-2 focus-within:ring-2 focus-within:ring-[#6bbfa6]">
              <User size={24} className="text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="ml-2 w-full text-sm outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="w-[320px] px-6 flex items-center rounded-lg border border-[#6bbfa6] bg-white py-2 focus-within:ring-2 focus-within:ring-[#6bbfa6]">
              <Mail size={24} className="text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="ml-2 w-full text-sm outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="w-[320px] px-6 flex items-center rounded-lg border border-[#6bbfa6] bg-white py-2 focus-within:ring-2 focus-within:ring-[#6bbfa6]">
              <Lock size={24} className="text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="ml-2 w-full text-sm outline-none"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="w-[320px] px-6 flex items-center rounded-lg border border-[#6bbfa6] bg-white py-2 focus-within:ring-2 focus-within:ring-[#6bbfa6]">
              <Briefcase size={24} className="text-gray-400" />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="ml-2 w-full text-sm outline-none bg-transparent"
                required
              >
                <option value="reviewer">Reviewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-full w-[160px] bg-[#2e4d3d] py-2 text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs">
            Already have an account?{" "}
            <Link to="/" className="cursor-pointer text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden flex-1 flex-col items-center justify-center bg-[#1f8f6a] text-white md:flex">
        <div className="mb-15 flex flex-col items-center">
          <div className="flex items-center gap-4">
            <img src={logo} alt="logo" className="w-30 flex-shrink-0" />
            <div>
              <h1 className="text-8xl font-light tracking-wide">RUBISCAPE</h1>
              <h3 className="text-3xl font-light">MAKE SENSE</h3>
            </div>
          </div>
          <p className="text-3xl font-light tracking-wide text-stone-800 mt-20">
            JOIN THE WORKFLOW PORTAL
          </p>
        </div>
      </div>
    </div>
  );
}

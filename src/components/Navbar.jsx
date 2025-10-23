import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { User, Menu, X } from "lucide-react";

function Navbar({ user }) {
  const { title } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Haqiqatan ham chiqmoqchimisiz?")) {
      localStorage.removeItem("loggedUser");
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-5 md:px-1">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-white tracking-wide hover:text-yellow-300 transition-all"
        >
          Quiz<span className="text-yellow-300">Master</span>
        </Link>

        {/* Title (optional) */}
        {title && (
          <span className="hidden md:block text-white text-lg font-medium capitalize tracking-wide">
            {title}
          </span>
        )}

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-5">
          <Link
            to="/"
            className="text-white font-semibold hover:text-yellow-300 transition"
          >
            Home
          </Link>

          {user?.role === "teacher" && (
            <>
              <Link
                to="/create-question"
                className="text-white font-semibold hover:text-yellow-300 transition"
              >
                Test yaratish
              </Link>
              <Link
                to="/dashboard"
                className="text-white font-semibold hover:text-yellow-300 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/leaderboard"
                className="text-white font-semibold hover:text-yellow-300 transition"
              >
                Reyting
              </Link>
              <Link
                to="/results-overview"
                className="text-white font-semibold hover:text-yellow-300 transition"
              >
                Natijalar
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-gray-800 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-white font-semibold transition"
              >
                <User size={20} />
                {user.name}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    👤 Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    🚪 Chiqish
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-indigo-700 transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? "max-h-[400px] py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center gap-3 px-6">
          <Link
            to="/"
            className="text-white font-semibold hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {user?.role === "teacher" && (
            <>
              <Link
                to="/create-question"
                className="text-white font-semibold hover:text-yellow-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Test yaratish
              </Link>
              <Link
                to="/dashboard"
                className="text-white font-semibold hover:text-yellow-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/leaderboard"
                className="text-white font-semibold hover:text-yellow-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Reyting
              </Link>
              <Link
                to="/results-overview"
                className="text-white font-semibold hover:text-yellow-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Natijalar
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-green-500 text-white w-full text-center py-2 rounded-xl font-semibold hover:bg-green-600 transition"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-gray-800 w-full text-center py-2 rounded-xl font-semibold hover:bg-gray-100 transition"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="bg-white text-indigo-700 w-full text-center py-2 rounded-xl font-semibold hover:bg-indigo-50 transition"
                onClick={() => setMenuOpen(false)}
              >
                👤 Profil
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white w-full text-center py-2 rounded-xl font-semibold hover:bg-red-600 transition"
              >
                🚪 Chiqish
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

import { Link, useParams } from "react-router-dom";
import React, { useState } from "react";

function Navbar({ user }) {
  const { title } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 transition">
          QuizApp
        </Link>

        {title && (
          <span className="text-white text-lg font-medium capitalize tracking-wide">
            {title}
          </span>
        )}

        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition">
            Home
          </Link>

          {user?.role === "teacher" && (
            <>
              <Link to="/create-question" className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-xl hover:bg-yellow-300 transition">
                Test yaratish
              </Link>
              <Link to="/dashboard" className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition">
                Dashboard
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition">
                Register
              </Link>
            </>
          ) : (
            <span className="text-white font-semibold">Salom, {user.name}</span>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-indigo-600 px-6 py-4 space-y-2">
          <Link to="/" className="block px-4 py-2 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {user?.role === "teacher" && (
            <>
              <Link to="/create-question" className="block px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-xl hover:bg-yellow-300 transition" onClick={() => setMenuOpen(false)}>
                Test yaratish
              </Link>
              <Link to="/dashboard" className="block px-4 py-2 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="block px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <span className="block text-white font-semibold">Salom, {user.name}</span>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;

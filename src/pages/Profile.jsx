import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Edit3, Save } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const saved = JSON.parse(localStorage.getItem("loggedUser"));
  const [user, setUser] = useState(saved || { name: "", phone: "", role: "teacher" });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!saved) navigate("/login");
  }, [saved, navigate]);

  const handleSave = () => {
    localStorage.setItem("loggedUser", JSON.stringify(user));
    setEditing(false);
    alert("✅ Profil saqlandi!");
  };

  const handleLogout = () => {
    if (window.confirm("Chiqishni xohlaysizmi?")) {
      localStorage.removeItem("loggedUser");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-indigo-200">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-3">
            {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
          </div>
          <h2 className="text-3xl font-extrabold text-indigo-700">
            {user.name || "Foydalanuvchi"}
          </h2>
          <p className="text-gray-500 font-medium">{user.role === "teacher" ? "O‘qituvchi" : "Talaba"}</p>
        </div>

        {/* Tahrirlash / Chiqish tugmalari */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setEditing((s) => !s)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition ${
              editing
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <Edit3 size={18} />
            {editing ? "Bekor qilish" : "Tahrirlash"}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
          >
            <LogOut size={18} />
            Chiqish
          </button>
        </div>

        {/* Forma */}
        <div className="space-y-5">
          {/* Ism */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Ism</label>
            <input
              type="text"
              className={`w-full border rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none transition ${
                editing
                  ? "focus:ring-2 focus:ring-indigo-400 border-indigo-200"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              disabled={!editing}
              placeholder="Ismingizni kiriting"
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Telefon</label>
            <input
              type="tel"
              className={`w-full border rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none transition ${
                editing
                  ? "focus:ring-2 focus:ring-indigo-400 border-indigo-200"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              disabled={!editing}
              placeholder="+998 90 123 45 67"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Rol</label>
            <input
              className="w-full border rounded-xl px-4 py-2.5 bg-gray-100 text-gray-700 cursor-not-allowed"
              value={user.role}
              disabled
            />
          </div>

          {/* Saqlash tugmasi */}
          {editing && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition"
              >
                <Save size={18} /> Saqlash
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

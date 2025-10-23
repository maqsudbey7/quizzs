import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Avval mavjud foydalanuvchilarni olamiz
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Shu raqam bilan oldin ro‘yxatdan o‘tgan foydalanuvchi bormi?
    const existingUser = users.find((u) => u.phone === phone);

    if (existingUser) {
      alert("Bu telefon raqami allaqachon ro‘yxatdan o‘tgan!");
      return;
    }

    const newUser = { name, phone, password, role };

    // Yangi foydalanuvchini massivga qo‘shamiz
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Foydalanuvchini avtomatik login qilamiz
    localStorage.setItem("loggedUser", JSON.stringify(newUser));

    alert(`Welcome ${name}! Account created successfully.`);
    if (role === "teacher") navigate("/dashboard");
    else navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+998XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-xl hover:bg-green-600 transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

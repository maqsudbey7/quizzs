import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";

function Home() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    // agar login bo‘lmagan bo‘lsa — login sahifasiga yo‘naltir
    if (!user) {
      navigate("/login");
      return;
    }

    // localStorage dan fanlarni olish
    const data = JSON.parse(localStorage.getItem("subjects")) || {};
    setSubjects(Object.keys(data));
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-12">
      {/* Navbar */}
      <div className="absolute top-4 right-6 flex items-center gap-4">
        <span className="text-gray-700 font-medium">
          👋 {user?.name} ({user?.role})
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition"
        >
          Logout
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-12 mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
          <span className="block">Welcome to the</span>
          <span className="text-indigo-600">Frontend Quiz!</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Pick a subject below to get started 👇
        </p>
      </div>

      {/* Subjects grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length === 0 ? (
          <div className="col-span-full text-center bg-white p-8 rounded-2xl shadow-md">
            <p className="text-gray-700">
              Hozircha fanlar yo‘q.{" "}
              {user?.role === "teacher" ? (
                <Link
                  to="/create-question"
                  className="text-indigo-500 hover:text-indigo-700 font-semibold underline"
                >
                  Yangi fan qo‘shish
                </Link>
              ) : (
                <span className="text-gray-500">
                  (Faqat o‘qituvchi fan qo‘sha oladi)
                </span>
              )}
            </p>
          </div>
        ) : (
          subjects.map((subj, index) => (
            <Link
              key={index}
              to={`/quiz/${subj}`}
              className="group bg-white rounded-2xl shadow-md p-6 flex flex-col justify-center items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex justify-center items-center mb-4 group-hover:bg-indigo-500 transition-all">
                <span className="text-indigo-600 group-hover:text-white text-2xl font-bold">
                  {subj[0].toUpperCase()}
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {subj}
              </span>
            </Link>
          ))
        )}
      </div>

      {/* O‘qituvchilar uchun fan qo‘shish tugmasi */}
      {user?.role === "teacher" && subjects.length > 0 && (
        <div className="mt-10">
          <Link
            to="/create-question"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-500 transition"
          >
            ➕ Yangi fan qo‘shish
          </Link>
        </div>
      )}
    </section>
  );
}

export default Home;

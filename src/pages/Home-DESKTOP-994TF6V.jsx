import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";

function Home() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("subjects")) || {};
    setSubjects(Object.keys(data)); // faqat fan nomlari
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
          <span className="block">Welcome to the</span>
          <span className="text-indigo-600">Frontend Quiz!</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Pick a subject below to get started 👇
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length === 0 ? (
          <div className="col-span-full text-center bg-white p-8 rounded-2xl shadow-md">
            <p className="text-gray-700">
              Hozircha fanlar yo‘q.{" "}
              <Link
                to="/create-question"
                className="text-indigo-500 hover:text-indigo-700 font-semibold underline"
              >
                Yangi fan qo‘shish
              </Link>
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
    </section>
  );
}

export default Home;
